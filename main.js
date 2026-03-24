const recommendBtn = document.getElementById('recommend-btn');
const resultDiv = document.getElementById('result');

const lunchMenu = ['김치찌개', '된장찌개', '제육볶음', '돈까스', '냉면', '부대찌개', '비빔밥', '짜장면', '짬뽕', '탕수육', '초밥', '우동', '라멘', '카레', '햄버거', '피자', '치킨', '떡볶이', '순대', '김밥'];

recommendBtn.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * lunchMenu.length);
  const selectedMenu = lunchMenu[randomIndex];
  resultDiv.textContent = `오늘 점심은 ${selectedMenu} 어떠세요?`;
});

// Animal Face Test Logic
const URL = "https://teachablemachine.withgoogle.com/models/KK32F0C6g/";
let model, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        labelContainer = document.getElementById("label-container");
    } catch (e) {
        console.error("Model loading failed:", e);
        labelContainer.innerHTML = "모델을 불러오는데 실패했습니다.";
    }
}

async function predict() {
    if (!model) return;
    
    const image = document.getElementById("face-image");
    const prediction = await model.predict(image, false);
    
    // Sort predictions by probability (descending)
    prediction.sort((a, b) => b.probability - a.probability);

    labelContainer.innerHTML = ""; // Clear previous results

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        
        const probabilityPercent = (prediction[i].probability * 100).toFixed(1);
        
        const barContainer = document.createElement("div");
        barContainer.className = "label-bar-container";
        
        const labelName = document.createElement("div");
        labelName.className = "label-name";
        labelName.innerHTML = prediction[i].className;
        
        const barWrapper = document.createElement("div");
        barWrapper.className = "bar-wrapper";
        
        const barFill = document.createElement("div");
        barFill.className = "bar-fill";
        barFill.style.width = probabilityPercent + "%";
        barFill.innerHTML = probabilityPercent + "%";
        
        // Dynamic color based on class (optional, using default blue for now)
        if (i === 0) {
             barFill.style.backgroundColor = "#e74c3c"; // Highlight top result
        }

        barWrapper.appendChild(barFill);
        barContainer.appendChild(labelName);
        barContainer.appendChild(barWrapper);
        labelContainer.appendChild(barContainer);
    }
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('.image-upload-wrap').hide();
      $('.file-upload-image').attr('src', e.target.result);
      $('.file-upload-content').show();
      $('.image-title').html(input.files[0].name);
      
      // Predict when image is loaded
      if (!model) {
          init().then(() => {
              // slight delay to ensure image render
              setTimeout(predict, 100); 
          });
      } else {
          setTimeout(predict, 100);
      }
    };

    reader.readAsDataURL(input.files[0]);
  } else {
    removeUpload();
  }
}

function removeUpload() {
  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $('.image-upload-wrap').show();
  $('#label-container').empty();
}

$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
});

$('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});

// Initialize model on page load (optional, or wait for upload)
// init();