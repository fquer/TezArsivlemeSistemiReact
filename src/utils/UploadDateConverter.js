import moment from "moment/moment";

export default function calculateUploadDates(uploadDate) {
    const now = moment();
    const upload = moment(uploadDate);
    const diff = moment.duration(now.diff(upload));

    console.log(`${diff.days()} gün, ${diff.hours()} saat, ${diff.minutes()} dakika ve ${diff.seconds()} saniye önce yüklenmiş.`);

    if (diff.days() !== 0) {
      return diff.days() + " gün önce yüklendi."
    }
    else if (diff.hours() !== 0) {
      return diff.hours() + " saat önce yüklendi."
    }
    else if (diff.minutes() !== 0) {
      return diff.minutes() + " dakika önce yüklendi."
    }
    else if (diff.seconds() !== 0) {
      return diff.seconds() + " saniye önce yüklendi."
    }
}