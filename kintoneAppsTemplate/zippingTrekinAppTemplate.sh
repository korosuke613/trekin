#!/usr/bin/env bash

set -euo pipefail

zip_name=TrekinKintoneAppsTemplate
template_dir=01
#template_json_path=$template_dir/template.json
#
#template_json_one_line=$(jq -r -c < $template_json_path)
#echo "$template_json_one_line" > $template_json_path

zip -r $zip_name.zip $template_dir

