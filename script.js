// 🔥 Твоя Firebase-ссылка
const FIREBASE_URL = 'https://abubakr-views-default-rtdb.firebaseio.com/views.json';

window.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const content = document.getElementById('content');
  const video = document.getElementById('bg-video');
  const music = document.getElementById('bg-music');
  const volumeSlider = document.getElementById('volumeControl');
  const viewNumber = document.getElementById('view-number');

  // 🎧 Музыка по умолчанию
  music.volume = 0.4;

  // 🎛 Регулятор громкости управляет музыкой
  volumeSlider.addEventListener('input', () => {
    const value = parseFloat(volumeSlider.value);
    music.volume = value;
  });

  // 📊 Получаем просмотры
  function getViews(callback) {
    fetch(FIREBASE_URL)
      .then(res => res.json())
      .then(data => callback(data ?? 3145));
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

      // Видео остаётся без звука
      video.muted = true;
      video.play().catch(() => {});

      // Музыка запускается
      music.play().catch(() => {});
      music.volume = parseFloat(volumeSlider.value);

      incrementViews(views => {
        if (viewNumber) {
          viewNumber.innerText = views;
        }
      });
    }, 500);
  });
});
