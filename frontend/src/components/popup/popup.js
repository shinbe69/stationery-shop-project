import './popup.css'

export default function Popup({ message }) {
    return (
        <div id='warningPopup'>
            <p id='popUpMessage'>{ message }</p>
        </div>
    )
}

export function showPopup() {
    document.getElementById('warningPopup').style.transform = 'translateY(0vh)'
    setTimeout(() => {
        document.getElementById('warningPopup').style.transform = 'translateY(-50vh)'
    }, 2500)
}

export function selectTypeOfPopup(type) {
    switch (type) {
        case 'WARNING':
        default:
            document.getElementById('warningPopup').style.backgroundColor = 'rgb(255, 15, 15)'
            break
        case 'SUCCESS':
            document.getElementById('warningPopup').style.backgroundColor = 'rgb(48, 180, 44)'
            break
    }
}