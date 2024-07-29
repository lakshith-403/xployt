import './styles/styles.scss'

window.onload = () => {
    let rootDiv = document.getElementById("root")
    let h1 = document.createElement("h1")
    h1.innerText = "Hello World"
    rootDiv.appendChild(h1)
}