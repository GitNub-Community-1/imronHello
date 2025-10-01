// 🔥 Твоя Firebase-ссылка
const FIREBASE_URL = 'https://abubakr-views-default-rtdb.firebaseio.com/views.json';

window.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const content = document.getElementById('content');
  const music = document.getElementById('bg-music');
  const viewText = document.getElementById('view-count');
  const canvas = document.getElementById('viewChart');
  const ctx = canvas.getContext('2d');
  const volumeSlider = document.getElementById('volumeControl');
volumeSlider.addEventListener('input', () => {
  music.volume = parseFloat(volumeSlider.value);
});


  // 📈 Рисуем график
  function drawChart(views) {
    let steps = 10;
    let data = [];
    for (let i = 0; i < steps; i++) {
      let value = Math.floor((views / steps) * i + Math.random() * 10);
      data.push(value);
    }
    data.push(views);

    let maxViews = Math.max(...data);
    let points = data.map((v, i) => ({
      x: (i / (data.length - 1)) * canvas.width,
      y: canvas.height - (v / maxViews) * canvas.height
    }));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    if (viewText) {
      viewText.innerText = `Просмотров: ${views}`;
    }
  }

  // 📊 Получаем просмотры
  function getViews(callback) {
    fetch(FIREBASE_URL)
      .then(res => res.json())
      .then(data => {
        const views = data ?? 3145; // если нет данных — старт с 3145
        callback(views);
      });
  }

  // 🔁 Увеличиваем просмотры
  function incrementViews(callback) {
    getViews(current => {
      const updated = current + 1;
      fetch(FIREBASE_URL, {
        method: 'PUT',
        body: JSON.stringify(updated)
      }).then(() => callback(updated));
    });
  }

  // 🎬 Показываем интро каждый раз
  intro.style.display = 'block';
  content.style.display = 'none';

  // 👆 Клик по интро
  document.querySelector('.overlay').addEventListener('click', () => {
    intro.style.transition = 'opacity 0.5s ease';
    intro.style.opacity = '0';

    setTimeout(() => {
      intro.style.display = 'none';
      content.style.display = 'block';
      document.body.classList.add('fade-in');

      music.play().catch(() => {});
      music.volume = 0.4; // 40% громкости
      incrementViews(drawChart);
    }, 500);
  });
});
