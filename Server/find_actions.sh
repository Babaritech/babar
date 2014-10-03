#!/bin/zsh

for file in *.php; do
	filename=$(echo $file | sed 's/.php//')

	cat "$file" | grep "case '" | while read action; do
		actionName=$(echo $action | sed -r "s/case '(.+)':/\1/g")
		echo "$filename-$actionName"
	done
done	
