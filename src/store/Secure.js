import SecureLS from 'secure-ls'

const password = null

const security = new SecureLS({ encodingType: 'AES', encryptionSecret: password, isCompression: false })

try {
  security.get('session')
} catch (e) {
}

export default security
