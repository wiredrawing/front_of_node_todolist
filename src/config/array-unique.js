



export default function arrayUnique (target) {
  let unique = [];

  target.forEach((value, index) => {
    if (unique.indexOf(value) === -1) {
      unique.push(value);
    }
  })

  return unique;
}
