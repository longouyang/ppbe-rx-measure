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

(to rebuild on any file changes, use `npm run watch`)

to view the experiment, open docs/main.html (i'm hosting the experiment on github pages, so the compiled experiment needs to live in /docs)

# dev notes: how i installed cosub

``` shell
pip install -e git+https://github.com/longouyang/cosub.git#egg=cosub
pip freeze > requirements.txt
```
