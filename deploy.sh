#!/bin/bash
if [[ $1 =~ staging|production ]]; then
  sls deploy --stage $1 --verbose
else
  echo "Invalid stage name"
fi
