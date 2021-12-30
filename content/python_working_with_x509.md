Title: Python: working with X.509
Date: 2019-02-21 07:30
Modified: 2021-02-19 07:39
Category: Python
Tags: coding, python, crypto, infosec

### Intro
This is a note dump of working with x509 in Python. There is not much context to it  
just a dump of code snippets.  

### Needed Packages:
* pyopenssl
* cryptography

### Generating a RSA Private Key:

```Python
import datetime
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID

# Generate RSA Key Pair
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048,
    backend=default_backend()
)

# Get RSA Public Key
public_key = private_key.public_key()
```

### Generate x509 Self Signed Certificate:

```Python
# Build x509 Cert
builder = x509.CertificateBuilder()
builder = builder.subject_name(x509.Name([
    x509.NameAttribute(NameOID.COMMON_NAME, u'yoururl.com'),
]))
builder = builder.issuer_name(x509.Name([
    x509.NameAttribute(NameOID.COMMON_NAME, u'yoururl.com'),
]))
builder = builder.not_valid_before(datetime.datetime.today() - one_day)
# Today + 30 days
builder = builder.not_valid_after(datetime.datetime.today() + (one_day * 30))
builder = builder.serial_number(x509.random_serial_number())
builder = builder.public_key(public_key)
builder = builder.add_extension(
    x509.SubjectAlternativeName(
        [x509.DNSName(u'yoururl.com')]
    ),
    critical=False
)
builder = builder.add_extension(
    x509.BasicConstraints(ca=False, path_length=None), critical=True,
)
# Export Self Signed Cert
certificate = builder.sign(
    private_key=private_key, algorithm=hashes.SHA256(),
    backend=default_backend()
)
```

### Generate x509 CSR (Certificate Signing Request):

```Python
# Build x509 CSR
builder = x509.CertificateSigningRequestBuilder()
builder = builder.subject_name(x509.Name([
    x509.NameAttribute(NameOID.COMMON_NAME, u'yoururl.com'),
]))
builder = builder.add_extension(
    x509.BasicConstraints(ca=False, path_length=None), critical=True,
)
request = builder.sign(
    private_key, hashes.SHA256(), default_backend()
)
```

### Write CSR to a file:

```Python
with open('yourname.csr', 'wb') as csr:
    csr.write(request)
```

### Looking at date in PEM certs:

```Python
>>> from OpenSSL.crypto import FILETYPE_PEM, load_certificate
>>> with open('pki_ca.pem', 'rt') as cert:
...         pk = load_certificate(FILETYPE_PEM, cert.read())
>>> pk.get_notBefore()
b'20190212080550Z'
>>> pk.get_notAfter()
b'20290209080620Z’
>>> pk.get_issuer().get_components()
[(b'CN', b'auto.localhost.local')]
```

### Load Private Key, PEM Certificate and CSR:

```Python
>>> from OpenSSL.crypto import (
FILETYPE_PEM,
load_certificate,
load_certificate_request,
load_publickey
)
# Load CSR and others with the same style just use the proper loader
>>> with open('mycsr.csr') as csr_file:
...   csr = load_certificate_request(FILETYPE_PEM, csr_file.read())
```

### Check Signature of CSR certs:

```Python
with open('test_pub.pem') as pem_file:
...   pem = load_certificate(FILETYPE_PEM, pem_file.read())
...   bool(csr.verify(pem.get_pubkey()))
...
True
```
### Working with CA CRL:

When working with Client SSL certificate verification one will run into the problem of creating a CRL PEM file of the  
Root CA's CRL file and its Intermediate CA's CRL files. This could come in a binary DER format that will need to be   
converted to PEM. Multiple PEM CRLs can be saved to a single concatenated file.  

```Python
# Load DER format CRL
from cryptography import x509
from cryptography.hazmat.backends import default_backend
with open('/tmp/crl/DODSWCA_54.crl', 'br') as crl_file:
    crl = x509.load_der_x509_crl(crl_file.read(), backend=default_backend())

# Cryptography >=3.4.5 you can omit the backend arg

# Save CRL Object as PEM format file
from cryptography.hazmat.primitives import serialization
with open("/tmp/crl/test.crl", "wb") as crl_file:
    crl_file.write(crl.public_bytes(serialization.Encoding.PEM))
```

