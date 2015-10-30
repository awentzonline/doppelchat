git checkout release
git pull origin release
git merge master
npm run dist
git add .
git commit -a -m "Build"
git gh-deploy dist
git checkout master
