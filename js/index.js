const MODEL_NAME = './model/model.json';
const LABELS_NAME = './skin_labels.txt';
const IMAGE_SIZE = 256;

async function init(){
    model=await tf.loadGraphModel(MODEL_NAME);
    labels = load_labels(LABELS_NAME).split('\r\n');
    console.log('load model...');
    console.log('labels ' + LABELS_NAME + ' loaded.');
    console.log(labels)
}

function load_labels(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
        result = xmlhttp.responseText;
    }
    return result;
}

function submit(){
    const selectFile = document.getElementById('input').files[0];
    console.log(selectFile);
    let reader = new FileReader();
    reader.onload = e =>{
        let img = document.createElement('img');
        img.src = e.target.result;
        img.width=144;
        img.height=144;
        img.onload=()=>{
            const showImage=document.getElementById('showImage');
            showImage.innerHTML='';
            showImage.appendChild(img);
            preadict(img);
        }
    }
    reader.readAsDataURL(selectFile);
}

function findMaxIndex(result){
    const arr = Array.from(result);
    let maxIndex = 0;
    let maxValue = 0;
    for(let i=0;i<arr.length;i++){
        if(arr[i]>maxValue){
            maxIndex=i;
            maxValue=arr[i]
        }
    }
    return {predNum: maxIndex, prob: maxValue};
}

function preadict(imgElement){
    const logits = tf.tidy(() => {
        const img = tf.cast(tf.browser.fromPixels(imgElement).resizeBilinear([IMAGE_SIZE, IMAGE_SIZE]), 'float32');
        // const offset = tf.scalar(255.0);
        // const normalized = img.div(img);
        const batched = img.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);
        const pred =  model.predict(batched);
        const result = pred.dataSync();
        console.log(result);
        console.log(result[0])
        
        for(let i=0;i<yValues.length;i++){
            yValues.splice(i,1,result[i]);
        }
        
        var ctx = document.getElementById("Chart").getContext("2d");        
        myChart.update()



        const {predNum, prob} =findMaxIndex(result);
        document.getElementById('resultValue').innerHTML=labels[predNum];
    });

}


var xValues = load_labels(LABELS_NAME).split('\r\n');
let yValues = [0, 0, 0, 0, 0, 0, 0, 0];
var barColors = ["red", "green","blue","orange","brown","yellow", "purple", "gray"];

let myChart = new Chart("Chart", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    legend: {
        display: false
    },
    title: {
      display: true,
      text: "病灶預測"
    },
    scales: {
        yAxes: [{
            ticks: {
                min: 0
            }
        }]
    }
  }
});