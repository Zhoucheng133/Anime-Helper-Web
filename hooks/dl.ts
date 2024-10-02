export interface DownloaderItem{
  title: string,
  ass: string
}

export interface DownloaderForm{
  ariaLink: string,
  ariaSecret: string,
  bangumi: DownloaderItem[],
  exclusions: string[],
  freq: number,
  type: string,
}