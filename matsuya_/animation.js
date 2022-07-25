const Name_header = document.querySelector('.header_matsuya');
const nameText = "松屋フーズ"
let start = 0;

const char_effect = () => {
    if(start < nameText.length){
        Name_header.innerHTML += nameText.charAt(start);
        start++;
        setTimeout(char_effect, 369);
    }
}
char_effect();