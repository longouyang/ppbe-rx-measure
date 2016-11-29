# setup

``` shell
npm install
virtualenv env
source env/bin/activate
pip install -r requirements.txt
```

# compiling from source

``` shell
npm run build
```

# dev notes: how i installed cosub

``` shell
pip install -e git+https://github.com/longouyang/cosub.git#egg=cosub
pip freeze > requirements.txt
```
