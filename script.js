// 🔥 Твоя Firebase-ссылка
const FIREBASE_URL = 'https://abubakr-views-default-rtdb.firebaseio.com/views.json';

window.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const content = document.getElementById('content');
  const video = document.getElementById('bg-video');
  const volumeSlider = document.getElementById('volumeControl');
  const viewNumber = document.getElementById('view-number');

  // 🔊 Устанавливаем громкость видео по умолчанию
  video.volume = 0.4;

  // 🎛 Регулятор громкости
  volumeSlider.addEventListener('input', () => {
    video.volume = parseFloat(volumeSlider.value);
  });

  // 📊 Получаем просмотры
  function getViews(callback) {
    fetch(FIREBASE_URL)
      .then(res => res.json())
      .then(data => {
        const views = data ?? 3145;
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

      video.muted = true;
      video.load();
      video.play().catch(() => {});
      video.volume = 0.4;

      incrementViews(views => {
        if (viewNumber) {
          viewNumber.innerText = views;
        }
      });
    }, 500);
  });
});
