/**
 * mediaData.ts — Your Memory Album Content
 * ==========================================
 * Add your own photos, videos, and audio files here.
 *
 * HOW TO ADD YOUR MEDIA:
 * 1. Upload your file to the GitHub repo root directory
 * 2. Add an entry below using the raw URL format:
 *    https://raw.githubusercontent.com/xhc0411abcdef-del/xhc-memories/main/FILENAME
 *
 * TYPES:
 *   - type: "photo" | "video" | "audio"
 *   - url: direct URL to the file
 *   - title: Display title (optional)
 *   - date: Date string like "2024-02-14" (optional)
 *   - description: Short caption (optional)
 *   - cover: Thumbnail image URL for video/audio (optional)
 */

export type MediaType = "photo" | "video" | "audio";

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  title?: string;
  date?: string;
  description?: string;
  cover?: string;
}

const BASE = "https://raw.githubusercontent.com/xhc0411abcdef-del/xhc-memories/main";

export const mediaItems: MediaItem[] = [
  { id: "1",  type: "photo", url: `${BASE}/00bcd634233defcab4601c6609fb79c8.jpg` },
  { id: "2",  type: "photo", url: `${BASE}/00ff1f2cb6369de135d639aea0f2238b.jpg` },
  { id: "3",  type: "photo", url: `${BASE}/01dd15c6e42cf6fd3c50667f6bd4370f.jpg` },
  { id: "4",  type: "photo", url: `${BASE}/04f9fce4378beda06d5d2b132685d87a.jpg` },
  { id: "5",  type: "photo", url: `${BASE}/0729594ebada27ceea88aefdde2039ad.jpg` },
  { id: "6",  type: "photo", url: `${BASE}/07d3035c99e4c7146f918bc62e1011c9.jpg` },
  { id: "7",  type: "photo", url: `${BASE}/0978fbcd87ab37ad0a7a0362f371130f.jpg` },
  { id: "8",  type: "photo", url: `${BASE}/0e06ee2d3676204583ad8db482851a50.jpg` },
  { id: "9",  type: "photo", url: `${BASE}/10d50412c693f2a31401b7421b6af0fa.jpg` },
  { id: "10", type: "photo", url: `${BASE}/16cfa3ae27fd311d04d241434693a0f7.jpg` },
  { id: "11", type: "photo", url: `${BASE}/173d6737d2aa5429bf4fb49045c9a9e5.jpg` },
  { id: "12", type: "photo", url: `${BASE}/1a16a740fd76b70de97c83784938de13.jpg` },
  { id: "13", type: "photo", url: `${BASE}/1dffff7921d2de2782c4228744bb72b5.jpg` },
  { id: "14", type: "photo", url: `${BASE}/22fc20ae9a12741542fb81fb0708b903.jpg` },
  { id: "15", type: "photo", url: `${BASE}/257c882bbfd49f5a2e990dab235fc805.jpg` },
  { id: "16", type: "photo", url: `${BASE}/26f353c8d890f9b9e527dcb68905fcfe.jpg` },
  { id: "17", type: "photo", url: `${BASE}/2926ff803ec95bf8ec56611fb2944a01.jpg` },
  { id: "18", type: "photo", url: `${BASE}/298e0e195047b5407012e642792edd2b.jpg` },
  { id: "19", type: "photo", url: `${BASE}/2ad71c838f593f9a9d146b1432e212c4.jpg` },
  { id: "20", type: "photo", url: `${BASE}/2bdcefc4a6d5b4f634c00853aba66e4e.jpg` },
  { id: "21", type: "photo", url: `${BASE}/3330c6064dc01b958337a85596ca28f9.jpg` },
  { id: "22", type: "photo", url: `${BASE}/380b2debfa2d06e9cd74c44dc802006c.jpg` },
  { id: "23", type: "photo", url: `${BASE}/3f454aa591c69567cd8c8677eed783fc.jpg` },
  { id: "24", type: "photo", url: `${BASE}/3f9f84403dcd7b86aa46c045bc167fb4.jpg` },
  { id: "25", type: "photo", url: `${BASE}/41e2d79a92371f625f79b90133f40c2b.jpg` },
  { id: "26", type: "photo", url: `${BASE}/458f6c1962ad44bc3435368c86a90da6.jpg` },
  { id: "27", type: "photo", url: `${BASE}/4590243394b149ce1e77fad672f8db1f.jpg` },
  { id: "28", type: "photo", url: `${BASE}/50685fbde2c670701e10f1acd72c3708.jpg` },
  { id: "29", type: "photo", url: `${BASE}/52a73f7d8639b2007da1a129fceba773.jpg` },
  { id: "30", type: "photo", url: `${BASE}/54325276c905b9bff1e0cd5ed2a21d67.jpg` },
  { id: "31", type: "photo", url: `${BASE}/55b5b4c28714072819ad8fa261e84900.jpg` },
  { id: "32", type: "photo", url: `${BASE}/59fc7c08ac7f981264d54c2b456b0354.jpg` },
  { id: "33", type: "photo", url: `${BASE}/609c93fd931c07f347d56602a4c503ca.jpg` },
  { id: "34", type: "photo", url: `${BASE}/625ef345c519ccd982bec9af7aa5f11d.jpg` },
  { id: "35", type: "photo", url: `${BASE}/62b151a0a167eac9faacb19a8fa4bb8c.jpg` },
  { id: "36", type: "photo", url: `${BASE}/6711da20a3ebea86aa1eb33b7308fb09.jpg` },
  { id: "37", type: "photo", url: `${BASE}/691d8b6d410124fa99af4fa03f4e6c6a.jpg` },
  { id: "38", type: "photo", url: `${BASE}/6c963e81f539e403cd818555ebe8c98e.jpg` },
  { id: "39", type: "photo", url: `${BASE}/74acd15e553190b8c7056473b7f352a2.jpg` },
  { id: "40", type: "photo", url: `${BASE}/753817dc0e6be69374fc5e98d5ca9a49.jpg` },
  { id: "41", type: "photo", url: `${BASE}/7a8dd2b9b9de1671893a412443002c39.jpg` },
  { id: "42", type: "photo", url: `${BASE}/7bcd65e6cfadcdf93005b95612d3f15e.jpg` },
  { id: "43", type: "photo", url: `${BASE}/81c0d3c49ef342013bce9e9d5aadd487.jpg` },
  { id: "44", type: "photo", url: `${BASE}/894eea4b1c7e59eec40d0cde62d22fb1.jpg` },
  { id: "45", type: "photo", url: `${BASE}/89a7831f47cae654708d0a4914d1adf6.jpg` },
  { id: "46", type: "photo", url: `${BASE}/8c9f4f5e8233704b4cddc2e631ca29bf.jpg` },
  { id: "47", type: "photo", url: `${BASE}/8ed4ecc36ca55d45927eac17e2d178c0.jpg` },
  { id: "48", type: "photo", url: `${BASE}/943449e106840c4bb98272d0279c12ef.jpg` },
  { id: "49", type: "photo", url: `${BASE}/978c7058c8b80a1ef30123cac4ebddcd.jpg` },
  { id: "50", type: "photo", url: `${BASE}/9c5403283b6ab54c847df3a6634965dd.jpg` },
  { id: "51", type: "photo", url: `${BASE}/WechatIMG165.jpg` },
  { id: "52", type: "photo", url: `${BASE}/WechatIMG166.jpg` },
  { id: "53", type: "photo", url: `${BASE}/WechatIMG168.jpg` },
  { id: "54", type: "photo", url: `${BASE}/a190a23f08013efffe23c79e7fc48a54.jpg` },
  { id: "55", type: "photo", url: `${BASE}/a1f28a9da326ae6c51dbaafe74bbf163.jpg` },
  { id: "56", type: "photo", url: `${BASE}/ab0d20f08e97a772a038d2a1976e9124.jpg` },
  { id: "57", type: "photo", url: `${BASE}/b002bd8874dc85a7658da3364662a180.jpg` },
  { id: "58", type: "photo", url: `${BASE}/b39685860a7b8bd0dcfbb1bdd5b16310.jpg` },
  { id: "59", type: "photo", url: `${BASE}/b3ae447bd182871872cc8f734dd2895f.jpg` },
  { id: "60", type: "photo", url: `${BASE}/b6ac0be18f359700a2cc20fedb863385.jpg` },
  { id: "61", type: "photo", url: `${BASE}/b7be5e69f163f3a8b4f9245ab7cc7238.jpg` },
  { id: "62", type: "photo", url: `${BASE}/b969a8bfd015d6f76703988d0fd08731.jpg` },
  { id: "63", type: "photo", url: `${BASE}/ba19f0f7d69de68d74a9681fa81efb48.jpg` },
  { id: "64", type: "photo", url: `${BASE}/ba3ec9bb6f3598a29d0fceff51833370.jpg` },
  { id: "65", type: "photo", url: `${BASE}/c2b9f5b7fba52667e18a603ae6727ab4.jpg` },
  { id: "66", type: "photo", url: `${BASE}/c6541f3f201dc2c44c8377467ac2c8d6.jpg` },
  { id: "67", type: "photo", url: `${BASE}/c8c2474a734810ccec1f52184175eb10.jpg` },
  { id: "68", type: "photo", url: `${BASE}/cb3d46e14892a55d1527ac421c26d6de.jpg` },
  { id: "69", type: "photo", url: `${BASE}/cc1ef0bb5cb839b6b651cda8e68b3706.jpg` },
  { id: "70", type: "photo", url: `${BASE}/d2b4153061cd700a876ec78d7ba13668.jpg` },
  { id: "71", type: "photo", url: `${BASE}/d445ec07a08a964ecc41f1ee02a73bc6.jpg` },
  { id: "72", type: "photo", url: `${BASE}/d6c3f81406069fbb74c66c5b4ccfde55.jpg` },
  { id: "73", type: "photo", url: `${BASE}/d99c2adda210b154a0c89808deb9c5e7.jpg` },
  { id: "74", type: "photo", url: `${BASE}/da5eb762000892b9ebf530f6dc1e0972.jpg` },
  { id: "75", type: "photo", url: `${BASE}/de9498a1daf37829d527af4008451c48.jpg` },
  { id: "76", type: "photo", url: `${BASE}/df3b792bb8ec1283d21b7c05b816305a.jpg` },
  { id: "77", type: "photo", url: `${BASE}/e125e49a6836b0365845090c6cc5c20e.jpg` },
  { id: "78", type: "photo", url: `${BASE}/e203b181d7b6973c2b25bc898a419e76.jpg` },
  { id: "79", type: "photo", url: `${BASE}/e71d0ee1699f4007fdcbf2afdd7fab35.jpg` },
  { id: "80", type: "photo", url: `${BASE}/ec31695001c7fa95537ea45a8fa995e9.jpg` },
  { id: "81", type: "photo", url: `${BASE}/ee9303933ded6be769ce526be33a4a98.jpg` },
  { id: "82", type: "photo", url: `${BASE}/fd43d000a509052a1f9bac99ed69746a.jpg` },
  { id: "83", type: "photo", url: `${BASE}/fea6d4f58784f6266e4e49085e47214a.jpg` },
  { id: "84", type: "photo", url: `${BASE}/ff6d7296e8722bafe428dc298dfbbb52.jpg` },

  // ---- 视频和音频 ----
  // 上传文件到仓库后，按以下格式添加：
  // { id: "v1", type: "video", url: `${BASE}/your-video.mp4`, title: "标题" },
  // { id: "a1", type: "audio", url: `${BASE}/your-audio.m4a`, title: "标题" },
];
