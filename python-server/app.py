import json
from copy import deepcopy
from typing import Union
from config.config import CONFIG
from logger import logger
from flask import Flask, request, Response
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import MoonRegistration as mr
import MoonRegistration.MoonRegistrate as mrr


app = Flask(__name__)

# add CORS support for this backend
# we should consider remove CORS and hide it under a reverse proxy when deploying
# so we can kind prevent people from abusing this api
CORS(app)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=CONFIG['default_rate_limits'],
    storage_uri="memory://",
)

RESPONSE_TEMPLATE = {
    "ok": False,
    "payload": None,
    "status": -1
}

def obj_to_json_resp(data:Union[str,dict,list], ok=True, status=200) -> Response:
    output = deepcopy(RESPONSE_TEMPLATE)
    output.update({"ok":ok, "payload":data, "status":status})
    logger.debug(output)
    return Response(json.dumps(output, ensure_ascii=False), status=status, content_type="application/json")

def str_to_err_resp(data:str, status=400) -> Response:
    output = deepcopy(RESPONSE_TEMPLATE)
    output.pop("payload")
    output.update({"ok":False, "error":data, "status":status})
    logger.debug(output)
    return Response(json.dumps(output, ensure_ascii=False), status=status, content_type="application/json")

def translate_algorithm(algorithm:str) -> mrr.RegistrationAlgorithms:
    algorithm = algorithm.upper()
    if algorithm == 'SIFT':
        return mrr.RegistrationAlgorithms.SIFT
    elif algorithm == 'ORB':
        return mrr.RegistrationAlgorithms.ORB
    elif algorithm == 'AKAZE':
        return mrr.RegistrationAlgorithms.AKAZE
    elif algorithm == 'BRISK':
        return mrr.RegistrationAlgorithms.BRISK
    elif mr.MR_HAVE_OPENCV_NONFREE and algorithm == 'SURF':
        return mrr.RegistrationAlgorithms.SURF_NONFREE
    else:
        return mrr.RegistrationAlgorithms.INVALID_ALGORITHM

def is_good_file(name:str) -> bool:
    return (name in request.files and request.files[name].filename != '')

@app.route('/api/registrar/<algorithm>', methods=['POST'])
def registration(algorithm:str):
    logger.info(f'{algorithm = }')
    algorithm = translate_algorithm(algorithm)
    
    user_file = 'user-file'
    model_file = 'model-file'
    
    if is_good_file(user_file):
        user_file = request.files[user_file]
    else:
        return str_to_err_resp('Empty file or no selected file')
    if is_good_file(model_file):
        model_file = request.files[model_file]
    else:
        return str_to_err_resp('Empty file or no selected file')
    
    matrix = None
    
    try:
        registrar = mrr.MoonRegistrar()
        registrar.update_images(
            user_file.stream.read(),
            model_file.stream.read()
        )
        registrar.update_f2d_detector(algorithm)
        
        registrar.compute_registration()
        
        matrix = registrar.get_homography_matrix()
        matrix = matrix.tolist()
        
    except Exception as err:
        err = str(err)
        logger.error(err)
        return str_to_err_resp(err)
    
    return obj_to_json_resp(
        {'homography_matrix':matrix}
    )

