//функция принимает селектор изображений и вызывает колбэк когда они все загрузятся
export function onImgLoad(selector, callback) {
  const images = document.querySelectorAll(selector);
  let counterLoad = images.length;
  images.forEach(image => {
    image.onload = () => {
      counterLoad -= 1;
      if (counterLoad == 0) {
        callback();
      }
    };
  });
}
