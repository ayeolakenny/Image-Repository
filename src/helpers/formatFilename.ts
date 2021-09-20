import moment from "moment";
import shortid from "shortid";

export const formatFilename = (filename: string) => {
  const date = moment().format("YYYYMMDD");
  const randomString = Math.random().toString(36).substring(2, 7);
  const newFilename = `${shortid.generate()}-${date}-${randomString}-${filename}`;
  return newFilename;
};
