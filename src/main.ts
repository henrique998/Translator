import './styles/global.scss'
import './styles/main.scss'

import { languages } from './languages'

const firstLanguagesSelect = document.querySelector<HTMLSelectElement>('#first-languages-select')
const secondLanguagesSelect = document.querySelector<HTMLSelectElement>('#second-languages-select')

const firstTextarea = document.querySelector<HTMLTextAreaElement>('#first-textarea')
const secondTextarea = document.querySelector<HTMLTextAreaElement>('#second-textarea')

const textareaContentCounter = document.querySelector<HTMLSpanElement>('#textarea-content-counter')

const clearContentButton = document.querySelector<HTMLButtonElement>('#clear-content-button')
const copyContentButton = document.querySelector<HTMLButtonElement>('#copy-content-button')

const firstSpeechButton = document.querySelector<HTMLButtonElement>('#first-speech-button')
const secondSpeechButton = document.querySelector<HTMLButtonElement>('#second-speech-button')

type Languages = typeof languages

function populateLanguagesSelect(select: HTMLSelectElement | null, languages: Languages) {
  if (!select) {
    return
  }

  languages.forEach(language => {
    select.innerHTML += `
      <option value="${language.code}">
        ${language.name}
      </option>
    `
  })
}

populateLanguagesSelect(firstLanguagesSelect, languages)
populateLanguagesSelect(secondLanguagesSelect, languages)

function updateContentCounter() {
  firstTextarea?.addEventListener('input', () => {
    const contentLenght = firstTextarea?.value.length
  
    if (contentLenght >= 101) return
  
    if (!textareaContentCounter) {
      return
    }
  
    textareaContentCounter.textContent = `${contentLenght}/5000`
  })
}

updateContentCounter()

function clearContent() {
  const contentLenght = firstTextarea?.value.length

  if (contentLenght === 0 || !firstTextarea || !secondTextarea || !textareaContentCounter) {
    return
  }

  firstTextarea.value = ""
  secondTextarea.value = ""
  textareaContentCounter.textContent = "0/5000"
}

clearContentButton?.addEventListener('click', clearContent)

function translateContent() {
  if (!secondTextarea) {
    return
  }

  const contentToTranslate = firstTextarea?.value ?? ''
  const firstLanguage = firstLanguagesSelect?.value
  const secondLanguage = secondLanguagesSelect?.value
  
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${firstLanguage}&tl=${secondLanguage}&dt=t&q=${encodeURI(
    contentToTranslate
  )}`

  fetch(url)
    .then(response => response.json())
    .then(result => {
      secondTextarea.value = result[0].map((words: string[]) => words[0]).join('')
    })
}

firstTextarea?.addEventListener('input', translateContent)

function copyContentToClipBoard() {
  if (!secondTextarea || secondTextarea?.value.length === 0) {
    return
  }

  const content = secondTextarea.value

  navigator.clipboard.writeText(content)

  const icon = copyContentButton?.querySelector('i')

  icon?.setAttribute('class', 'ph-bold ph-check-circle')

  setTimeout(() => {
    icon?.setAttribute('class', 'ph-copy-fill')
  }, 1000)
}

copyContentButton?.addEventListener('click', copyContentToClipBoard)

function convertContentToSpeech(textarea: HTMLTextAreaElement | null) {
  if (!textarea) {
    return
  }

  const content = textarea.value

  const synth = speechSynthesis 
  const utternance = new SpeechSynthesisUtterance(content)
  const voices = synth.getVoices()
  utternance.voice = voices[3]
  speechSynthesis.speak(utternance)
}

firstSpeechButton?.addEventListener('click', () => convertContentToSpeech(firstTextarea))
secondSpeechButton?.addEventListener('click', () => convertContentToSpeech(secondTextarea))

function translateContentOnLanguageChanges() {
  if (!secondLanguagesSelect) {
    return
  }

  secondLanguagesSelect.addEventListener('change', translateContent)
}

translateContentOnLanguageChanges()
