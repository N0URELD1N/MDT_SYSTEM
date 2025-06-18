// تكوين عنوان الخادم الخلفي
const API_BASE_URL = 'http://localhost:5000/api';

function toggleCustomType() {
  const caseType = document.getElementById("caseType").value;
  const customField = document.getElementById("customCaseType");
  customField.style.display = (caseType === "آخر") ? "block" : "none";
}

function submitReport() {
  const reporterName = document.getElementById("reporterName").value.trim();
  const missionStatus = document.getElementById("missionStatus").value;
  const caseType = document.getElementById("caseType").value;
  const customType = document.getElementById("customCaseType").value.trim();
  const personName = document.getElementById("personName").value.trim();
  const additionalInfo = document.getElementById("additionalInfo").value.trim();
  const imageInput = document.getElementById("personImage");
  const violationsSelect = document.getElementById("violations");
  const timestamp = new Date().toLocaleString('ar-EG', { hour12: false });

  // التحقق من البيانات المطلوبة
  if (!reporterName || !personName) {
    alert("يرجى ملء جميع الحقول المطلوبة");
    return;
  }

  // جمع المخالفات المحددة
  const selectedViolations = Array.from(violationsSelect.selectedOptions).map(option => option.value);

  const finalCaseType = (caseType === "آخر") ? customType : caseType;

  // إعداد البيانات للإرسال
  const reportData = {
    reporterName,
    missionStatus,
    caseType: finalCaseType,
    violations: selectedViolations,
    personName,
    additionalInfo,
    timestamp
  };

  // معالجة الصورة إذا كانت موجودة
  if (imageInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function () {
      reportData.imageData = reader.result;
      sendReportToAPI(reportData);
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    reportData.imageData = null;
    sendReportToAPI(reportData);
  }
}

function sendReportToAPI(reportData) {
  fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reportData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    document.getElementById("confirmation").textContent = "تم إرسال التقرير بنجاح!";
    document.getElementById("confirmation").style.color = "green";
    
    // مسح النموذج بعد الإرسال الناجح
    document.getElementById("reporterName").value = "";
    document.getElementById("personName").value = "";
    document.getElementById("additionalInfo").value = "";
    document.getElementById("personImage").value = "";
    document.getElementById("customCaseType").value = "";
    document.getElementById("violations").selectedIndex = -1;
    
    // إخفاء حقل النوع المخصص
    document.getElementById("customCaseType").style.display = "none";
    document.getElementById("caseType").selectedIndex = 0;
    document.getElementById("missionStatus").selectedIndex = 0;
  })
  .catch(error => {
    console.error("حدث خطأ:", error);
    document.getElementById("confirmation").textContent = "حدث خطأ أثناء إرسال التقرير. يرجى المحاولة مرة أخرى.";
    document.getElementById("confirmation").style.color = "red";
  });
}

