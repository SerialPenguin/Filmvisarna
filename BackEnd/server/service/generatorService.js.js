function generateBookingNumber() {

  const randomChars = []

  for(let i = 0; i < 6; i++) {
    let random;

    if(i <= 2){
      random = Math.floor(Math.random() * (90 - 65) + 65);
    }
    else {
      random = Math.floor(Math.random() * 10);
    }

    if(random < 10 || random > 64) {
      if(random > 64) random = String.fromCharCode(random)
      randomChars.push(random);
    }else i--;
  }

  let result = randomChars.join('');

  return result;
}

function generatePassword() {

  const randomChars = []

  for(let i = 0; i < 8; i++) {
    let random;

    if(i % 2 === 0){
      random = Math.floor(Math.random() * (122 - 65) + 65);
    }
    else {
      random = Math.floor(Math.random() * 10);
    }

    if(random <= 10 || random >= 65) {
      if(random >= 65 && random <= 90 || random >= 97 && random <= 122) random = String.fromCharCode(random)
      randomChars.push(random);
    }else i--;
  }

  let result = randomChars.join('');

  return result;
}

export default { generateBookingNumber, generatePassword };