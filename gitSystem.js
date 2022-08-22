const path = require('path');
const fs = require('fs');
const date = {};


class Git {
    static add(paths) {
        let file = fs.readdirSync(paths);
        for (let i = 0; i < file.length; i++) {
            let link = path.join(paths, file[i]);
            if (fs.lstatSync(link).isFile()) {
                date[file[i]] = {status: 'untracked', path: link};

            } else if (fs.lstatSync(link).isDirectory()) {
                date[file[i]] = {status: 'untracked', path: link};
                Git.add(link);
            }
        }
        if (typeof JSON.stringify(date, null, 2) == 'string') {
            fs.writeFileSync('paths.txt', JSON.stringify(date, null, 2));
        }
    }


    static changeStatus(absPath = '.') {
        let date = JSON.parse(fs.readFileSync('paths.txt'));
        if (absPath === '*' || absPath === '.') {
            for (const dateKey in date) {
                date[dateKey].status = 'tracked';
            }
        } else {

            if (fs.lstatSync(absPath).isDirectory()) {
                for (const dateKey in date) {
                    if (date[dateKey].path.includes(absPath)) {
                        date[dateKey].status = 'tracked';
                    }
                }
            } else if (fs.lstatSync(absPath).isFile()) {
                for (const dateKey in date) {
                    if (date[dateKey].path===absPath) {
                        date[dateKey].status = 'tracked';
                    }
                }
            }
        }
        fs.writeFileSync('paths.txt', JSON.stringify(date, null, 2));
    }
}



module.exports=Git