const ytdl = require('ytdl-core')
const express = require('express')
const app = express()
const port = 3000

app.get('/', async (req, res) => {
    let url = req.query.url
    const getVideo = async () => {
        const videoID = url
        let info = await ytdl.getInfo(videoID)
        // let audioFormats = ytdl.filterFormats(info.formats, 'audioonly')
        // return console.log('Formats with only audio: ' + audioFormats.length);
        let arr = []
        info.formats.map((value) => {
            let quality = value.qualityLabel
            let container = value.container
            let type = value.mimeType.substring(0,5)
            let bitrate = value.bitrate
            if (type == 'audio') {
                bitrate = value.audioBitrate
            }
            let audio = value.audioCodec
            if (audio == null) {
                audio = false
            } else {
                audio = true
            }
            let url = value.url
            let codec = value.codecs
            arr.push({
                'Type': type,
                'Quality': quality,
                'Audio': audio,
                'Codec': codec,
                'Container': container,
                'Bitrate': bitrate,
                'URL': url
            })
        })
        return info
    }
    try {
        const apiData = await getVideo()
        return res.status(200).json({
            result: apiData,
        })
    } catch (error) {
        return res.status(500).json({
            error: error.toString(),
    })
}
  })

app.listen(port, () => {
    console.log(`Youtube-dl API listening on port ${port}`)
  })