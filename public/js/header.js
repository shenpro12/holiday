const headerContainer = document.getElementById('header-container');
const btnUp = document.getElementById('btn_up');
const logo = document.getElementById('logo-image');
window.addEventListener("scroll", function() {
    var x = pageYOffset;
    if (x > 80) {
        headerContainer.classList.add('dropdown')
        logo.src = "/img/logoscroll.png"
    } else if (x == 0) {
        headerContainer.classList.remove('dropdown')
        logo.src = "/img/logo.png"
    }
    if (x > 250) {
        btnUp.style.display = "block";
    } else if (x < 250) {
        btnUp.style.display = "none";
    }

})
btnUp.onclick = function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
var userTextName = document.getElementsByClassName("user-textName");
for (let item of userTextName) {
    let name = item.innerText.slice(0, 1)
    item.innerText = name;
}