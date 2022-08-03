from django.urls import path

from . import views

urlpatterns = [
    path('', views.index_page, name='index_page'),
    path('town_ajax', views.get_town, name='get_town'),
    path('search_ajax', views.search_list, name='search_list')
]