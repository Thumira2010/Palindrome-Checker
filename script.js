const inputText = document.getElementById("inputText");
const checkBtn = document.getElementById("checkBtn");
const result = document.getElementById("result");
const historyList = document.getElementById("historyList");
const resetHistoryBtn = document.getElementById("resetHistoryBtn");




let timeout;
const debounceTime = 300;

function cleanText(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function isPalindrome(text) {
  const cleaned = cleanText(text);
  return cleaned === cleaned.split('').reverse().join('');
}

function showResult(isPalin) {
  result.textContent = isPalin ? "✅ Palindrome" : "❌ Not a Palindrome";
  result.classList.remove("hidden");
  result.classList.add("show");
  inputText.classList.remove("correct", "incorrect");
  inputText.classList.add(isPalin ? "correct" : "incorrect");
}

function updateHistory(input, isPalin) {
  let history = JSON.parse(localStorage.getItem("palindromeHistory")) || [];
  history.unshift({ input, result: isPalin });
  history = history.slice(0, 5);
  localStorage.setItem("palindromeHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("palindromeHistory")) || [];
  historyList.innerHTML = "";

  history.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `${entry.input} → ${entry.result ? '✅' : '❌'}`;
    
    // Apply animation to only the first two items (which are newly reordered)
    if (index > 1) {
      li.classList.add("animate-in");
    }

    historyList.appendChild(li);
  });

  // Auto scroll to top of the history list when updated
  historyList.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleCheck() {
  const text = inputText.value.trim();
  if (!text) return;
  const resultBool = isPalindrome(text);
  showResult(resultBool);
  updateHistory(text, resultBool);
}

resetHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem("palindromeHistory");
  renderHistory();
});

function debounceCheck(){
    if (!inputText.value.trim()) {
        result.classList.add("hidden");
        inputText.classList.remove("correct", "incorrect");
    }
}
checkBtn.addEventListener("click", handleCheck);
inputText.addEventListener("input", debounceCheck);

// Load history on startup
renderHistory();