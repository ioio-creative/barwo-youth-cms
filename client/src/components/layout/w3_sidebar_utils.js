// https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_examples_material
// Change style of top container on scroll
window.onscroll = _ => {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document
      .getElementById('myTop')
      .classList.add('w3-card-4', 'w3-animate-opacity');
    document.getElementById('myIntro').classList.add('w3-show-inline-block');
  } else {
    document.getElementById('myIntro').classList.remove('w3-show-inline-block');
    document
      .getElementById('myTop')
      .classList.remove('w3-card-4', 'w3-animate-opacity');
  }
};

// Open and close the sidebar on medium and small screens
export const w3_open = _ => {
  document.getElementById('mySidebar').style.display = 'block';
  document.getElementById('myOverlay').style.display = 'block';
};

export const w3_close = _ => {
  document.getElementById('mySidebar').style.display = 'none';
  document.getElementById('myOverlay').style.display = 'none';
};
