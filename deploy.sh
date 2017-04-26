#!/bin/bash
ng build --prod --aot=false
cp dist/index.html dist/404.html
echo "wa.optimismbrewing.com" > dist/CNAME
ngh
