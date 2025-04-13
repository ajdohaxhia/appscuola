#!/bin/bash

# Run the Next.js build
npm run build

# Copy static files
mkdir -p out/_next
cp -r .next/static out/_next/
