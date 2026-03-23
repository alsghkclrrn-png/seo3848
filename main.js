const recommendBtn = document.getElementById('recommend-btn');
const resultDiv = document.getElementById('result');

const lunchMenu = ['김치찌개', '된장찌개', '제육볶음', '돈까스', '냉면', '부대찌개', '비빔밥', '짜장면', '짬뽕', '탕수육', '초밥', '우동', '라멘', '카레', '햄버거', '피자', '치킨', '떡볶이', '순대', '김밥'];

recommendBtn.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * lunchMenu.length);
  const selectedMenu = lunchMenu[randomIndex];
  resultDiv.textContent = `오늘 점심은 ${selectedMenu} 어떠세요?`;
});