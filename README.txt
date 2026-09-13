ÖĞRENCİ TAKİP SİSTEMİ v6.6 - MAKSİMUM GİZLİLİK PWA

YENİLİKLER
- Dış ağ bağlantıları CSP ile kapatıldı.
- fetch, XMLHttpRequest, WebSocket, EventSource ve sendBeacon çalışma zamanında engellendi.
- Service Worker sadece yerel/same-origin önbellek dosyalarını servis edecek şekilde sıkılaştırıldı.
- Harici origin istekleri engellendi.
- Gizlilik bilgi ekranı ve Yerel Veri Modu göstergesi eklendi.
- Üçüncü taraf bağlantısız çalışma hedefi güçlendirildi.

ÖĞRENCİ TAKİP SİSTEMİ v6.5 - iPhone / Android PWA

YENİLİKLER
- iPhone ve Android ana ekran kurulumuna uygun PWA paketi.
- 180, 192 ve 512 px uygulama simgeleri.
- iOS tam ekran/standalone meta ayarları.
- Safe-area uyumu (çentik ve alt home bar alanları).
- Dokunmatik buton boyutları geliştirildi.
- Telefona Kur yardım penceresi eklendi.
- Çevrimiçi / Çevrimdışı durum göstergesi eklendi.
- Service Worker önbelleği v6.5 için yenilendi.

ÖĞRENCİ TAKİP SİSTEMİ v6.4

GÖRSEL GÜNCELLEME
- Kısmen durumu mor olarak değiştirildi.
- Mazeretli durumu turuncu olarak değiştirildi.
- Öğrenci adlarının yanındaki durum noktaları 10 px'den 14 px'e büyütüldü.
- Durum butonları ve noktalar aynı renk mantığını kullanacak şekilde eşleştirildi.

ÖĞRENCİ TAKİP SİSTEMİ v6.3

YENİLİK
- Ödev ayrıntısında her öğrencinin adının yanında durumunu gösteren küçük renkli bir nokta eklendi.
- Yaptı = yeşil, Kısmen = turuncu, Mazeretli = mavi, Yapmadı = kırmızı.
- Durum düğmesine tıklandığında noktanın rengi aynı anda, pencere yenilenmeden değişir.

ÖĞRENCİ TAKİP SİSTEMİ v6.2

DÜZELTME
- Öğrenci ayrıntı penceresinde Hızlı İşlem düğmesine basıldığında aynı satırdaki Durum etiketi artık sayfa yenilenmeden anında değişir.
- Seçilen Hızlı İşlem düğmesi aynı anda aktif görünür; önceki aktif düğme pasifleşir.
- Öğrenci penceresinin üstündeki yaptı/toplam ve başarı yüzdesi de aynı anda güncellenir.

ÖĞRENCİ TAKİP SİSTEMİ v6.1

YENİLİKLER
- Öğrenci ayrıntısındaki hızlı işlem düğmesine basıldığında durum etiketi anında seçilen moda geçer.
- Notlar ekranında ortalama 50'nin altındaysa açık kırmızı, 50 ve üzerindeyse açık yeşil arka plan kullanılır.
- Ana ekrandaki Ayarlar düğmesi kaldırıldı; profil kartına tıklamak aynı ayar/profil penceresini açar.

ÖĞRENCİ TAKİP SİSTEMİ v6

YENİ ÖZELLİKLER
- Geri Al + Yinele (Redo): yanlışlıkla geri alınan işlem yeniden uygulanabilir.
- Notlar modülü:
  * 1. Sınav
  * 2. Sınav
  * 1. Performans
  * 2. Performans
  * Proje
  * Ortalama
- Proje notu boşsa ortalamaya dahil edilmez.
- Proje notu girilmişse diğer dört notla birlikte ortalamaya dahil edilir.
- Notlar CSV olarak dışa aktarılabilir.
- Öğrenci başka sınıfa taşınırken/kopyalanırken not kaydı da taşınır/kopyalanır.
- Önceki ödev, dönem, PIN, profil, JPEG, CSV, PDF bölge seçimi, taşıma/kopyalama özellikleri korunur.

ÇAPRAZ PLATFORM YAPISI
Bu paket iki şekilde kullanılabilir:

1) PWA / tarayıcı sürümü
- Windows / macOS / Linux / Android / iOS'ta tarayıcı üzerinden çalışabilir.
- Destekleyen platformlarda ana ekrana / uygulama olarak kurulabilir.
- Service Worker dosyası ile uygulama dosyaları önbelleğe alınabilir.

2) Tauri 2 yerel uygulama kaynakları
- src-tauri klasörü eklendi.
- Aynı arayüz Windows, macOS ve Linux masaüstüne;
  Android ve iOS'a yerel paket olarak derlenmek üzere hazırlandı.
- Windows installer / APK / AAB / iOS uygulaması oluşturmak için hedef platformun derleme araçları gerekir.

DERLEME GEREKSİNİMLERİ
- Node.js
- Rust
- Tauri CLI
- Android için Android Studio / Android SDK
- iOS için macOS + Xcode (Apple gereği)
- iOS cihazına dağıtım için Apple imzalama/provisioning gerekir.

ÖNEMLİ
Bu ZIP kaynak projedir; içinde doğrudan .exe/.apk/.ipa bulunmaz.
Bu ortamda Android SDK, Xcode ve platform imzalama araçları olmadığı için son ikili paketler oluşturulmadı.

VERİLER
Mevcut sürüm yerel tarayıcı depolamasını kullanır. Aynı cihazda çevrimdışı çalışır.
Farklı cihazlar arasında otomatik çevrimdışı senkronizasyon mümkün değildir;
"Cihaz Aktarım Yedeği" ile veri taşınabilir.
