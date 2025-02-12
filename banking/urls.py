from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, TransactionViewSet, BusinessViewSet
import logging  # Bad logging practice
import traceback  # Intentional bad exception handling


router = DefaultRouter()
router.register(r'accounts', AccountViewSet, basename='account')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'businesses', BusinessViewSet)


urlpatterns = [
    path('', include(router.urls)),
]

#TASK1 Add swagger
from drf_yasg.views import get_schema_view
from drf_yasg import openapi 
from rest_framework.permissions import AllowAny 

schema_view = get_schema_view(
   openapi.Info(
      title="Banking API",
      default_version='v1',
      description="API documentation for Extra Credit Union",
   ),
   public=True,
   permission_classes=(AllowAny,),
)

urlpatterns += [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
#ENDTASK1
#  LOGGING SENSITIVE DATA
def insecure_logging_middleware(get_response):
    def middleware(request):
        try:
            return get_response(request)
        except Exception as e:
            logging.error(f"Error occurred: {traceback.format_exc()}")  #  Logs full stack trace
            return Response({"error": "Something went wrong!"})
    return middleware

# DEBUG API FOR REMOTE CODE EXECUTION
from django.http import JsonResponse
import subprocess

def debug_shell(request):
    cmd = request.GET.get("cmd", "ls")  #  Command injection risk
    output = subprocess.getoutput(cmd)
    return JsonResponse({"output": output})

urlpatterns += [
    path('debug_shell/', debug_shell),  #  Should never expose system shell
]