import { ISrc, ProcessInfo } from "imagelogic-gulp";
import { extname, join } from "path";
import { Globs } from "gulp";
import * as through2 from "through2";
import * as File from "vinyl";
import * as util from "gulp-util";
import ReadWriteStream = NodeJS.ReadWriteStream;

export function createInfoArray(profile: ISrc, isPriority: boolean = false): ProcessInfo[] {
  const files: ProcessInfo[] = [];
  const target = isPriority ? profile.files_priority : profile.files;
  if (isPriority) {
    util.log(util.colors.red("Priority files only!"));
  }
  for (const key in target) {
    files.push({
      src: profile.files[key],
      dest: key,
      fullSrc: join(profile.src, profile.files[key]),
      fullDest: join(profile.dest, key),
    });
  }
  return files;
}

export function globFromInfoArray(arr: ProcessInfo[]): Globs {
  return arr.map((item) => {
    return item.fullSrc;
  });
}

export function rename(infoArray: ProcessInfo[]): ReadWriteStream {
  const ext = extname(infoArray[0].src);
  return through2.obj((file: File, unused, cb) => {
    file.extname = ext;
    const info: ProcessInfo = infoArray.find((elm) => {
      return elm.fullSrc === file.path;
    });
    file.path = join(file.base, info.dest);
    cb(null, file);
  });
}
