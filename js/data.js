/* Supa Topup — catalog data (single source, consumed by main.js & fx.js) */
window.SUPA = {
  brand: "Supa Topup",
  games: [
    {id:"ml",      name:"Mobile Legends",   cat:"moba",    icon:"🛡️", img:"img/ml.jpg",      tag:"-25%",   sold:"1,2Jt terjual", from:1000,  noms:[["3 💎",3000],["86 💎",19500],["172 💎",39000],["344 💎",78000],["720 💎",155000],["Twilight Pass",129000]]},
    {id:"ff",      name:"Free Fire",        cat:"battle",  icon:"🔥", img:"img/ff.jpg",      tag:"-30%",   sold:"980rb terjual", from:1000,  noms:[["50 💎",7000],["140 💎",19000],["355 💎",47000],["720 💎",95000],["Membership Mingguan",29000]]},
    {id:"genshin", name:"Genshin Impact",   cat:"rpg",     icon:"✨", img:"img/genshin.jpg", tag:"Instant",sold:"410rb terjual", from:16000, noms:[["60 Genesis",16000],["198 Genesis",48000],["328 Genesis",79000],["648 Genesis",159000],["Blessing Bulan",79000]]},
    {id:"valo",    name:"Valorant",         cat:"battle",  icon:"🎯", img:"img/valo.jpg",    tag:"-15%",   sold:"320rb terjual", from:15000, noms:[["375 Points",15000],["730 Points",29000],["1465 Points",59000],["2980 Points",119000]]},
    {id:"pubg",    name:"PUBG Mobile",      cat:"battle",  icon:"🪖", img:"img/pubg.jpg",    tag:"-20%",   sold:"510rb terjual", from:14000, noms:[["60 UC",14000],["325 UC",74000],["660 UC",149000],["1800 UC",379000]]},
    {id:"codm",    name:"COD Mobile",       cat:"battle",  icon:"💥", img:"img/codm.jpg",    tag:"New",    sold:"180rb terjual", from:10000, noms:[["63 CP",10000],["128 CP",20000],["320 CP",49000],["645 CP",99000]]},
    {id:"hok",     name:"Honor of Kings",   cat:"moba",    icon:"👑", img:"img/hok.jpg",     tag:"-18%",   sold:"140rb terjual", from:14000, noms:[["80 Token",14000],["240 Token",42000],["400 Token",69000]]},
    {id:"wuwa",    name:"Wuthering Waves",  cat:"rpg",     icon:"🌊", img:"img/wuwa.jpg",    tag:"-12%",   sold:"95rb terjual",  from:16000, noms:[["60 Lunite",16000],["330 Lunite",79000],["680 Lunite",159000],["Moon Card",79000]]},
    {id:"hsr",     name:"Honkai: Star Rail",cat:"rpg",     icon:"🚂", img:"img/hsrr.jpg",    tag:"Hot",    sold:"210rb terjual", from:16000, noms:[["60 Oneiric",16000],["330 Oneiric",79000],["680 Oneiric",159000],["Express Supply",159000]]},
    {id:"zzz",     name:"Zenless Zone Zero",cat:"rpg",     icon:"📺", img:"img/zzz.jpg",     tag:"New",    sold:"78rb terjual",  from:16000, noms:[["60 Polychrome",16000],["300 Poly",79000],["680 Poly",159000],["Monthly Card",79000]]},
    {id:"roblox",  name:"Roblox Credit",    cat:"voucher", icon:"🧱", img:"img/roblox.jpg",  tag:"-10%",   sold:"260rb terjual", from:15000, noms:[["400 Credit",15000],["800 Credit",29000],["1700 Credit",59000],["4500 Credit",149000]]},
    {id:"steam",   name:"Steam Wallet IDR", cat:"voucher", icon:"🎮", img:"",                tag:"Voucher",sold:"260rb terjual", from:12000, noms:[["Voucher 12rb",12000],["Voucher 45rb",45000],["Voucher 60rb",60000],["Voucher 120rb",120000],["Voucher 400rb",400000]]}
  ],
  ppob: [
    {id:"pulsa",  name:"Pulsa Semua Operator", cat:"pulsa", icon:"📱", desc:"Telkomsel · XL · Indosat · Tri · Smartfren", from:6000, denom:[["5rb",6000],["10rb",11200],["20rb",21000],["50rb",49500],["100rb",98500]]},
    {id:"data",   name:"Paket Data",           cat:"pulsa", icon:"🌐", desc:"Kuota harian, mingguan & bulanan all operator", from:12000, denom:[["1GB/7hr",12000],["5GB/30hr",55000],["20GB/30hr",95000],["100GB/30hr",185000]]},
    {id:"pln",    name:"Token & Tagihan PLN",  cat:"pln",   icon:"💡", desc:"Token prabayar s/d 10jt + pascabayar rumah/toko", from:21000, denom:[["20rb",21000],["50rb",50900],["100rb",101800],["500rb",509000]]},
    {id:"pdam",   name:"PDAM / Air",           cat:"air",   icon:"💧", desc:"Tagihan air bersih seluruh kota di Indonesia", from:10000},
    {id:"bpjs",   name:"BPJS Kesehatan",       cat:"air",   icon:"🏥", desc:"Cek tunggakan & bayar iuran bulanan keluarga", from:35000},
    {id:"emoney", name:"E-Money & E-Wallet",   cat:"money", icon:"💳", desc:"Top up GoPay, OVO, DANA, ShopeePay, Mandiri e-money", from:11000},
    {id:"tv",     name:"TV Kabel & Internet",  cat:"money", icon:"📺", desc:"IndiHome, First Media, MNC, Transvision, Biznet", from:50000},
    {id:"angsur", name:"Angsuran & Finance",   cat:"money", icon:"🏦", desc:"FIF, WOM, BAF, Mega Finance, Adira", from:50000},
    {id:"game",   name:"Voucher Game Fisik",   cat:"pulsa", icon:"🎟️", desc:"Voucher Google Play & Apple Gift Card resmi", from:14000}
  ],
  pays: [
    ["QRIS ⚡","0,7% · instan",0.007],
    ["GoPay","2% · instan",0.02],
    ["DANA","1,5% · instan",0.015],
    ["OVO","2% · instan",0.02],
    ["ShopeePay","1% · instan",0.01],
    ["BCA Virtual Account","Rp4.000 · 2 jam",4000],
    ["BRI Virtual Account","Rp4.000 · 2 jam",4000],
    ["Alfamart / Indomaret","Rp2.500 · retail",2500]
  ],
  rupiah:n=>"Rp"+Number(n||0).toLocaleString("id-ID"),
  feeOf:(base,pay)=>typeof pay[2]==="number"?(pay[2]<0.1?Math.round(base*pay[2]):pay[2]):0
};
