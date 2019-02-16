const safeContact = contact => {
  if (!contact) return null
  let url
  try {
    url = new URL(contact)
  } catch(err) {
    console.log(`${contact} is not a URL`)
    return null
  }
  const protocol = url.protocol
  if (protocol === 'mailto:' || protocol === 'http:' || protocol === 'https:') {
    return encodeURI(contact)
  } else {
    return null
  }
}

export {
  safeContact
}
