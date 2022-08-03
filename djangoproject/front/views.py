from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from .models import CountyList, TownList, Join

def index_page(request):
    county_list = CountyList.objects.all()
    return render(request, 'index.html',{
        'county_list': county_list,
    })

@csrf_exempt 
def get_town(request):
    get_id = request.POST.get('get_id')
    town_list = TownList.objects.filter(county_id = get_id)
    town_list = serializers.serialize('json', town_list)
    return HttpResponse(town_list)

@csrf_exempt
def search_list(request):
    get_id = request.POST.get('get_id')
    join_list = Join.objects.filter(town_id = get_id)
    join_list = serializers.serialize('json', join_list)
    return HttpResponse(join_list)
