// ===== КАРУСЕЛИ =====

document.querySelectorAll(".carousel").forEach(carousel => {
  const track = carousel.querySelector(".carousel-track");
  const cards = [...track.querySelectorAll(".photo-card")];
  const dotsBox = carousel.querySelector(".dots");

  if (!track || !cards.length || !dotsBox) return;

  let activeIndex = 0;

  // Создаём точки
  dotsBox.innerHTML = "";

  cards.forEach((card, index) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("aria-label", `Фото ${index + 1}`);

    dot.addEventListener("click", () => {
      activeIndex = index;
      scrollToCard(index);
    });

    dotsBox.appendChild(dot);
  });

  const dots = [...dotsBox.querySelectorAll(".dot")];

  // Позиция карточки внутри карусели
  function getCardPosition(index) {
    const card = cards[index];

    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    const cardLeft = cardRect.left - trackRect.left + track.scrollLeft;

    const centeredPosition =
      cardLeft - (track.clientWidth - card.clientWidth) / 2;

    const maxScroll = track.scrollWidth - track.clientWidth;

    return Math.max(0, Math.min(centeredPosition, maxScroll));
  }

  // Прокручиваем только карусель
  function scrollToCard(index) {
    track.scrollTo({
      left: getCardPosition(index),
      behavior: "smooth"
    });
  }

  // Обновляем активную точку
  function updateDots() {
    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter =
        card.getBoundingClientRect().left +
        card.getBoundingClientRect().width / 2;

      const trackCenter =
        track.getBoundingClientRect().left + track.clientWidth / 2;

      const distance = Math.abs(cardCenter - trackCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    activeIndex = closestIndex;

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === activeIndex);
    });
  }

  // Стрелки
  carousel.querySelector(".prev").addEventListener("click", () => {
    if (activeIndex <= 0) return;

    activeIndex--;
    scrollToCard(activeIndex);
  });

  carousel.querySelector(".next").addEventListener("click", () => {
    if (activeIndex >= cards.length - 1) return;

    activeIndex++;
    scrollToCard(activeIndex);
  });

  track.addEventListener("scroll", updateDots, { passive: true });
  window.addEventListener("resize", updateDots);

  updateDots();
});
// ===== ПОДАРОК: ОТКРЫТИЕ ФОТО БИЛЕТА =====
// ВАЖНО: замени ссылку
const ticketImageUrl = "https://sun9-7.vkuserphoto.ru/s/v1/ig2/1lbFRsofcCpLVUjYfxsbkD587zrNwosNgyoGuWtqezJ6nQv1mI_Id2U5ehuPTZjab6yZoKPgv6QpnZ9KB9wOEitktcIaBA.jpg?quality=95&as=32x23,48x34,72x51,108x76,160x113,240x169,360x254,480x339,540x381,640x452,720x508,1080x762,1155x815&from=bu&u=yC0nMlud2j5n9WOaCDz_FNMQYP7vOxP8psapNswPDRE&cs=640x0";
const giftContent = {
  show: `
    <img
      class="ticket-image"
      src="${ticketImageUrl}"
      alt="Билет на стендап Валентина Сидорова"
    >
  `
};
const modal = document.getElementById("gift-modal");
const modalBody = document.getElementById("modal-body");
let previousActiveElement = null;
// Открытие подарка
function openGift(type) {
  if (!modal || !modalBody || !giftContent[type]) return;
  previousActiveElement = document.activeElement;
  modalBody.innerHTML = giftContent[type];
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  const closeButton = modal.querySelector(".modal-close");
  if (closeButton) {
    closeButton.focus();
  }
}
// Закрытие подарка
function closeGift() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (modalBody) {
    modalBody.innerHTML = "";
  }
  if (
    previousActiveElement &&
    typeof previousActiveElement.focus === "function"
  ) {
    previousActiveElement.focus();
  }
}
// Нажатие на кнопку «Открыть подарок»
document.querySelectorAll("[data-modal]").forEach(button => {
  button.addEventListener("click", () => {
    openGift(button.dataset.modal);
  });
});
// Закрытие по крестику или по затемнённому фону
if (modal) {
  modal.querySelectorAll("[data-close]").forEach(element => {
    element.addEventListener("click", closeGift);
  });
}
// Закрытие клавишей Escape
document.addEventListener("keydown", event => {
  if (
    event.key === "Escape" &&
    modal &&
    modal.classList.contains("open")
  ) {
    closeGift();
  }
});