#! /usr/bin/env sh

rm -f ${HOME}/ecpoint.logs
touch ${HOME}/ecpoint.logs
npx frontail --disable-usage-stats -l 1000 ${HOME}/ecpoint.logs
