v7.6.49
- Masaüstünde PIN ekranının açılışta görünmemesi için bağımsız PIN boot guard eklendi.
- Mobil/PWA veri şeması, PIN hash biçimi ve yedek uyumluluğu korunur.

v7.6.0 - Deneme Sınavları Modülü
- Sınıf bazlı deneme oluşturma
- Katıldı/Girmedi takibi
- Ders bazlı Doğru/Yanlış/Boş ve otomatik net
- Önceki denemeye göre artış/düşüş
- Öğrenci ayrıntısında Deneme Geçmişi
- CSV şablon dışa aktarma ve CSV içe aktarma
- Mevcut v7.5.4 özellikleri korunmuştur.

v7.5.3.1 yükleme düzeltmesi:
- PWA start_url güncellendi.
- Service Worker sürüm anahtarı güncellendi.
- Eski v7.5.2 başlık/sürüm referansları düzeltildi.

ÖNEMLİ HOTFIX:
- v6.13 paketinde yanlışlıkla eksik kalan closeModal() fonksiyonu geri eklendi.
- Tüm modal pencerelerde Kapat düğmesi ve boş alana dokunarak kapatma yeniden çalışır.
- Klavyede Escape ile kapatma desteği eklendi.
- Service Worker önbellek anahtarı v7.0 olarak değiştirildi; güncellemenin iPhone'a daha güvenli ulaşması sağlandı.

ÖĞRENCİ TAKİP SİSTEMİ v7.0 - KAPAT BUTONU HOTFIX

YENİLİKLER
- Öğrenci ayrıntısındaki Hızlı İşlem butonları mobilde 2x2 düzene geçti; yatay taşma kaldırıldı.
- Raporlar mobilde öğrenci kartları halinde gösteriliyor.
- 5 ana sekme iPhone ekranına eşit sütunlarda sığacak şekilde düzenlendi.
- Ödev Matrisi açıklaması doğrudan buton kullanımına göre güncellendi; dar ekranda durum butonları 2x2 olur.
- Not ortalaması girilmiş notlarla hesaplanmaya devam eder; zorunlu not eksikse 'Eksik not' uyarısı ve eksik alanlar gösterilir. Gerçek 0 notu ortalamaya dahil edilir.
- Toplu Öğrenci / Toplu Ödev ekleme düğmeleri tam genişlik; ekleme sonucu ve mükerrer kayıt bilgisi gösterilir.
- CSV/XLSX dosyası seçilmeden 'Dosyayı Oku' pasiftir; okuma sonrası önizleme korunur.
- PDF Bölgesinden Al özelliğinde Yerel Veri Modu çakışması giderildi. PDF dosyası cihazdan çıkmaz. PDF.js motoru gerektiğinde yalnızca iki sabit jsDelivr dosyasından indirilir; başka dış ağ istekleri engellenmeye devam eder.

GİZLİLİK NOTU
PDF özelliği kullanıldığında cihaz yalnızca PDF.js statik motor dosyalarını indirmek için jsDelivr ile bağlantı kurar. Öğrenci listesi, notlar, PDF içeriği veya uygulama verileri bu bağlantıyla gönderilmez. PDF özelliği kullanılmazsa bu bağlantı kurulmaz.

ÖĞRENCİ TAKİP SİSTEMİ v6.12 - iPHONE EKRAN OPTİMİZASYONU

DÜZELTME
- iPhone PWA ilk açılışında ekranın büyütülmüş/geniş başlamasına karşı viewport ayarları sıkılaştırıldı.
- Uygulama ilk çizimden itibaren cihaz genişliğine sabitlenir.
- HTML/body ve ana mobil kapsayıcılarda yatay taşma engellendi.
- Mobil grid sütunları minmax(0,1fr) ile ekran genişliğine zorlandı.
- iOS otomatik metin büyütme kapatılarak tasarım ölçülerinin korunması sağlandı.
- Çift dokunma ile yeniden ölçekleme ihtiyacını ortadan kaldırmak için mobil viewport sabitlendi.
- Service Worker önbelleği v6.12 olarak güncellendi.

NOT
Bu sürümde iPhone üzerinde yanlışlıkla çift dokunma/pinch ile arayüz ölçeğinin değişmemesi için sayfa yakınlaştırması kilitlenmiştir.

ÖĞRENCİ TAKİP SİSTEMİ v6.11 - MOBİL KULLANIM GÜNCELLEMESİ

YENİLİKLER
- Mobilde üst kontrol alanının sabit kalması kaldırıldı; sayfayla birlikte yukarı kayar.
- Sınıf, öğrenci ve ödev ekleme için sistem prompt pencereleri yerine uygulama içi formlar eklendi.
- Öğrenci silme mobil öğrenci kartında görünür hale getirildi ve daha açıklayıcı onay eklendi.
- Sınıfı Sil ana ekrandan kaldırıldı; Sınıf Ayarları içindeki tehlikeli işlem bölümüne taşındı.
- Ödev ayrıntısındaki renkli durum noktası öğrenci adıyla aynı hizaya getirildi.
- Mobil öğrenci ve ödev listeleri kart görünümüne geçirildi.
- Notlar mobilde öğrenci başına kart görünümüne geçirildi.
- 1. dönem ve 2. dönem notları ayrı saklanır; eski tek dönem notları otomatik olarak 1. döneme taşınır.
- Ödev Matrisi mobilde öğrenci kartlarına dönüştürüldü; dört durum doğrudan seçilebilir.
- Mobil sekmeler yatay kaydırılabilir hale getirildi.
- Service Worker önbelleği v6.11 olarak güncellendi.

ÖĞRENCİ TAKİP SİSTEMİ v6.10 - PROFİL GÖRÜNÜM DÜZELTMESİ

- Profil oluşturulduğu halde üst bölümün boş görünmesi sorunu giderildi.
- Profil fotoğrafı yoksa ad-soyaddan otomatik baş harf avatarı gösterilir.
- Öğretmen adı ve okul adı üst bölümde açık biçimde gösterilir.
- Mobilde profil bilgisi varsa tam genişlikte kompakt kart görünür; profil yoksa kart gizlenir.
- Service Worker önbelleği v6.10 olarak güncellendi.

ÖĞRENCİ TAKİP SİSTEMİ v6.9 - GÜNCELLEME DÜZELTMESİ

DÜZELTME
- Eski Service Worker'ın index.html dosyasını sürekli önbellekten göstermesi nedeniyle yeni sürümün iPhone'a gelmemesi sorunu giderildi.
- Sayfa açılışlarında aynı origin'deki güncel index.html ağdan kontrol edilir; çevrimdışıyken önbelleğe dönülür.
- Service Worker kaydı updateViaCache='none' ile güncelleme kontrolünü zorlar.
- Dış origin bağlantıları hâlâ engellidir; öğrenci verileri sunucuya gönderilmez.

ÖĞRENCİ TAKİP SİSTEMİ v6.8 - MOBİL ÜST MENÜ DÜZENLEMESİ

YENİLİKLER
- iPhone'da Çevrimiçi göstergesinin yeniden görünmesine neden olan sınıf ezme hatası düzeltildi.
- Profil bilgisi girilmemişse boş profil kutusu mobilde gizlenir.
- Üst kontroller mobilde 3 sütunlu kompakt düzene geçirildi.
- Dönem / Geri Al / Yinele ilk sırada; Gizlilik / Yerel Veri Modu ikinci sırada; yedek kontrolleri daha düzenli yerleştirildi.
- Service Worker önbelleği v6.8 olarak yenilendi.

ÖĞRENCİ TAKİP SİSTEMİ v6.7 - MOBİL ARAYÜZ OPTİMİZASYONU

YENİLİKLER
- iPhone'da üst bölüm daha kompakt hale getirildi.
- PWA olarak kurulduğunda 'Telefona Kur' düğmesi gizlenir.
- Mobilde çevrimiçi göstergesi gizlenerek yer kazandırıldı.
- Yerel Veri Modu göstergesi küçültüldü.
- Mobil buton ve boş durum alanlarının ölçüleri sıkılaştırıldı.
- 'Sol menüden...' yönlendirmesi mobil kullanım için düzeltildi.
- Service Worker önbelleği v6.7 olarak güncellendi.

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


v7.0 HOTFIX:
- Öğrenciler / Ödevler / Ödev Matrisi / Notlar / Rapor sekmelerini yöneten switchTab() geri eklendi.
- v6.13.1 Kapat düğmesi düzeltmesi korundu.


v7.0:
- PDF seçim ekranı iPhone için tam ekran ve seçim modu ile yenilendi.
- Genişliğe sığdır, seçim temizleme ve daha belirgin seçim alanı eklendi.
- Metin tabanlı PDF bölge okuma toleransı geliştirildi.
- Normal Yedek Al JSON dosyası da Cihaz Aktarım içe aktarma ekranında kabul edilir.
- v6.13.2 sekme ve kapatma düzeltmeleri korunur.


v7.0 HOTFIX:
- iPhone'da Alan Seç modunda PDF'nin kaymasına neden olan touch-action CSS seçicisi düzeltildi.
- PDF canvas üzerindeki max-width kısıtı kaldırıldı; yakınlaştırma/uzaklaştırma artık gerçek boyutu değiştirir.
- Yakınlaştırma yüzdesi eklendi ve +/- adımları belirginleştirildi.
- v6.14 yedek uyumluluğu korunur.


v7.0 HOTFIX:
- iPhone/iPad PDF alan seçimi için özel touchstart/touchmove/touchend olayları eklendi.
- Seçim modunda PDF önizleme kaydırması geçici olarak kilitlenir.
- Seçim tamamlanınca kaydırma otomatik geri açılır.
- Yakınlaştırma ve yedek uyumluluğu korunur.


v7.0 HOTFIX:
- PDF'de seçim tamamlandıktan sonra mavi seçim alanı ekranda kalır.
- Alan Seç düğmesi seçimden sonra 'Alanı Değiştir' olur.
- Seçim modu kapanır ama seçilen dikdörtgen görünmeye devam eder.


v7.0 HOTFIX:
- PDF yakınlaştırma/uzaklaştırma sonrasında seçili alan görünür kalır.
- Seçim dikdörtgeni yeni zoom oranına göre ölçeklenir.
- Genişliğe Sığdır işleminde de seçili alan korunur.
- PDF metin okuma ve önceki düzeltmeler korunur.


v7.0 HOTFIX:
- Yakınlaştırılmış PDF üzerinde yeni alan seçildiğinde mavi seçim kutusunun görünmemesi düzeltildi.
- Seçim kutusu piksel yerine yüzde tabanlı konumlandırılır; zoom seviyesinden bağımsız görünür.
- iPhone Safari/PWA için seçim katmanına zorunlu yeniden çizim desteği eklendi.


v7.0 TAM YEDEK:
- 'Yedek Al' artık yalnızca öğrenci verilerini değil tüm uygulama verilerini yedekler.
- Yedeğe sınıflar, öğrenciler, ödevler, ödev durumları, notlar, dönem bilgisi, öğretmen adı, okul bilgisi, profil fotoğrafı ve uygulama ayarları dahil edilir.
- PIN ayarı da settings içinde cihazlar arasında aktarılır.
- Eski ham yedek dosyalarıyla geriye dönük uyumluluk korunur.
- Yeni dosya adı: ogrenci_takip_TAM_yedek.json


v7.0 YEDEK ARAYÜZÜ:
- Üst bölümdeki iki ayrı yedek alma düğmesi teke indirildi.
- 'Yedek Al' düğmesi hem tam yedek hem de cihazlar arası aktarım dosyası üretir.
- Mobilde 'Yedek Al' düğmesi 'Kilitle' düğmesinin hemen yanına taşındı.
- Tam yedek içeriği v6.15 ile aynıdır: sınıflar, öğrenciler, ödevler, notlar, öğretmen/okul bilgileri, profil fotoğrafı ve ayarlar.


v7.0 MOBİL / JPEG / EKSİK LİSTESİ:
- Mobilde sınıf adı ve dönem bilgisi ekranın ortasına hizalandı.
- Öğrenci JPEG ve diğer JPEG raporlarının iPhone/PWA'da dışa aktarımı düzeltildi; iPhone'da paylaşım/Dosyalara Kaydet ekranı kullanılır.
- Ana ekrandaki Eksik kutusu tıklanabilir hale getirildi.
- Eksik kutusuna dokununca Yapmadı durumundaki ödevleri olan öğrenciler ve eksik ödev adları listelenir.
- Tam yedek ve PDF öğrenci alma özellikleri korunur.


v7.0 GELİŞMİŞ RAPOR:
- Sınıf özeti eklendi: tamamlanma, toplam eksik, eksik öğrenciler ve not ortalaması.
- Ödev bazlı durum kartları eklendi.
- Ödev durum sayılarına dokununca ilgili öğrenciler listelenir.
- Öğrenci rapor kartına dokununca öğrenci ayrıntısı açılır.
- Yaptı/Kısmen/Mazeretli/Yapmadı kutularına dokununca ilgili ödevler listelenir.


v7.0 RAPOR KULLANILABİLİRLİK:
- Ödev Bazlı Durum ve Öğrenci Durumu bölümleri açılır/kapanır hale getirildi.
- Öğrenci raporuna isim/numara araması eklendi.
- Öğrenci sıralama seçenekleri: ada göre, en çok eksik, en düşük tamamlanma, en yüksek tamamlanma.
- Bölüm açık/kapalı durumu aynı oturumda korunur.


v7.0 ÖĞRENCİ AYRINTISI:
- Öğrenci ayrıntısına dönem seçici eklendi.
- Ödev tamamlanma ve not ortalaması özet kartları eklendi.
- Not ortalamasına dokununca notlar ve eksik zorunlu notlar görüntülenir.
- Yaptı/Kısmen/Mazeretli/Yapmadı özetleri dokunulabilir.
- JPEG/Kopyala/Taşı işlemleri kompaktlaştırıldı.
- Öğretmen Notu otomatik kayıt bilgisi eklendi.


v7.0 ÖĞRENCİ TAŞIMA / ÖZET HOTFIX:
- Başka Sınıfa Kopyala kaldırıldı; öğrenci tek sınıfta tutulur.
- Başka Sınıfa Taşı korunur.
- Taşımada öğretmen notu ve her iki dönemin notları yeni sınıfa aktarılır.
- Eski sınıfın ödev durumları, sınıfların ödevleri farklı olabileceği için aktarılmaz.
- Öğrenci Özeti ve Not Ortalaması kartı daha görünür hale getirildi.
- Gelecek uygulama güncellemelerinde service worker değişince açık sayfanın otomatik yenilenmesi eklendi.


v7.0 STABİL:
- Sınıf, öğrenci, ödev, not, rapor, tam yedek/cihaz aktarımı ve kalıcılık testleri başarıyla tamamlandı.
- Ödev Matrisi ve diğer hızlı durum ekranlarında seçili durum çok daha belirgin hale getirildi.
- Seçili butonda kalın koyu çerçeve, beyaz ayırıcı gölge ve ✓ işareti gösterilir.
- Seçim durumu erişilebilirlik için aria-pressed ile de işaretlenir.
- v6.21'deki öğrenci taşıma, gelişmiş rapor, JPEG, PDF ve tam yedek özellikleri korunur.


v7.1 AKILLI UYARILAR + GÜNLÜK ÖZET:
- Ana sınıf ekranına Akıllı Uyarılar · Günlük Özet paneli eklendi.
- Eksik ödev, üst üste 3 eksik ödev, düşük ödev tamamlama, eksik zorunlu not ve 50 altı not ortalaması otomatik izlenir.
- Uyarılar mevcut verilerden otomatik üretilir; öğretmenin ayrıca veri girmesi gerekmez.
- Uyarı kartına dokununca ilgili öğrenciler listelenir; Ayrıntı ile öğrenci ekranına geçilir.
- Eksik not uyarısı yalnızca ilgili öğrencide not girişi başlamışsa gösterilir; gereksiz erken uyarı azaltılır.
- Düşük tamamlama uyarısı en az 2 dönem ödevi olduğunda çalışır.
- Günlük özet paneli ileride Ders Programı, Nöbet, Veli Görüşmesi ve Deneme modüllerinden gelecek bildirimlere genişletilebilecek şekilde ayrıldı.
- v7.0 STABİL veri yapısı ve mevcut özellikler korunur.


v7.1.1 GÜNCELLEME HOTFIX:
- PWA güncellemesinin eski v7.0 ekranında kalması sorununa karşı servis worker kaydı cache-busting ile yenilendi.
- Uygulama başlığı, görünür sürüm ve yedek appVersion bilgileri v7.1.1 olarak güncellendi.
- Manifest start_url sürüm parametresi ile güncellendi.
- Akıllı Uyarılar + Günlük Özet özellikleri korunur.


v7.1.5 PDF SATIR OKUMA HOTFIX:
- Uzun seçili alanlarda komşu öğrenci satırlarının yanlışlıkla birleşmesi düzeltildi.
- PDF satır gruplaması daha dar Y toleransı ve satır bazlı kümeleme ile yenilendi.
- v7.1.4 Türkçe karakter/glif boşluk düzeltmeleri korunur.


v7.1.6 PDF AD-SOYAD AYIRMA HOTFIX:
- Bazı satırların aday listesinde atlanmasına neden olan fazla agresif kelime birleştirme düzeltildi.
- Artık sadece kısa Türkçe glif parçaları bitiştirilir; ad ve soyad sütunları ayrı tutulur.
- Uzun seçili alandaki tüm satırların aday olarak algılanması iyileştirildi.


v7.1.7 PDF SATIR ÇAPASI HOTFIX:
- Öğrenci numarası sütunu satır çapası olarak kullanılır.
- Aynı satırdaki ad ve soyad parçaları küçük dikey kaymalarda kaybolmadan ilgili numaraya bağlanır.
- Uzun alan seçimlerinde bazı isimlerin aday listesinden düşmesi düzeltildi.
- Türkçe karakter/glif boşluk düzeltmeleri korunur.


v7.1.8 PDF SATIR BANDI HOTFIX:
- Öğrenci numaraları satır merkezi olarak kullanılır.
- Ad/soyad parçaları artık sert dikey toleransla değil, komşu numaraların orta noktalarıyla oluşan satır bantlarına atanır.
- Bu sayede dikey konumu farklı olan soyadların ve bazı isimlerin aday listesinden düşmesi engellenir.
- Ham seçili alan metni başlığında bulunan satır sayısı gösterilir.


v7.1.9 PDF ADAY FİLTRESİ HOTFIX:
- 23 ham satır okunmasına rağmen 18 aday gösterilmesine neden olan filtre düzeltildi.
- Öğrenci numarası bulunan satırlar, ad-soyad tek parça gelmiş olsa bile artık aday listesinden düşmez.
- Numarasız gürültü satırlarında eski koruma devam eder.
- Aday başlığında bulunan öğrenci adaylarının sayısı gösterilir.


v7.1.10 PDF NUMARASIZ SEÇİM HOTFIX:
- Öğrenci numarası sütunu seçilmediğinde bazı öğrencilerin aday listesinden düşmesi düzeltildi.
- PDF'nin ad ve soyadı tek token olarak verdiği MANSURÖZCANAN / AYŞEÇELİK benzeri satırlar artık korunur.
- Başlık/gürültü satırları için özel filtre korunur.
- Numaralı seçimdeki 23/23 davranışı korunur.


v7.1.11 PDF AD-SOYAD SÜTUN AYIRMA:
- v7.1.10'daki 23/23 numaralı ve numarasız okuma korunur.
- PDF üzerindeki büyük yatay boşluklar ad/soyad sütun sınırı olarak korunur.
- MANSURÖZCANAN -> MANSUR ÖZCANAN, ZENANÖZKAPLAN -> ZENAN ÖZKAPLAN gibi birleşmeler hedeflenir.
- BURAK BARAN gibi çok kelimeli adlar fiziksel sütun yapısına göre korunur.


v7.1.12 PDF HEDEFLİ TÜRKÇE GLİF HOTFIX:
- Y İĞİ T gibi PDF tarafından kısa glif kümelerine ayrılan tek kelimeler hedefli biçimde birleştirilir.
- v7.1.10'daki 23/23 öğrenci okuma ve v7.1.11 ad-soyad sütun ayrımı korunur.
- Genel kelime boşluklarına dokunulmaz; çok kelimeli adların korunması hedeflenir.


v7.1.13 PDF AYNI SÜTUN KELİME BOŞLUĞU HOTFIX:
- MELİKİSMAİL ÖZER gibi aynı Adı sütununda kaybolan kelime boşlukları fiziksel x-aralığına göre geri getirilir.
- v7.1.12'deki YİĞİT glif düzeltmesi, 23/23 okuma ve ad-soyad sütun ayrımı korunur.
- İsim sözlüğü kullanılmaz; yalnızca PDF üzerindeki gerçek karakter mesafesi esas alınır.


v7.1.14 PDF AYRI TEXT ITEM KELİME KORUMA:
- Yalnızca boşluk mesafesine güvenmek yerine PDF text item sınırları kullanılır.
- Aynı sütunda iki ayrı çok-harfli text item ayrı kelime olarak korunur.
- MELİK + İSMAİL -> MELİK İSMAİL hedeflenir.
- Y + İĞİ + T gibi kısa Türkçe glif parçaları yine birleşik tutulur.
- 23/23 okuma ve önceki PDF düzeltmeleri korunur.



v7.2.0 — ÖĞRETMEN DERS PROGRAMI
- Sol menüye Ders Programı eklendi.
- Kullanıcının mevcut programı başlangıç verisi olarak işlendi.
- Şu anki / sıradaki ders otomatik hesaplanır.
- Program elle düzenlenebilir; ders ekleme/silme ve ders saatleri değiştirilebilir.
- Aktif program adı ve yürürlük tarihi tutulur.
- Program değişince eski programlar arşivlenebilir ve yeniden aktif yapılabilir.
- PDF'den Program Al: metin tabanlı ders programlarında sayfa geometrisini kullanarak gün/ders/sınıf bloklarını otomatik algılamayı dener.
- PDF sonucu doğrudan uygulanmaz; önce önizleme gösterilir ve kullanıcı onaylarsa aktif program olur.
- Ders programı settings içinde tutulduğu için mevcut Tam Yedek sistemine otomatik olarak dahildir.
- iPhone ana ekran widget'ı bu sürümde henüz yoktur; v7.2 veri yapısı widget için hazırlanmıştır.



v7.2.1 — PIN GİRİŞ EKRANI HOTFIX
- v7.2.0'da uygulama açılışında ders programı varsayılan saatleri, JS sabiti initialize edilmeden okunuyordu.
- Bu JavaScript'i başlangıçta durduruyor ve PIN giriş / PIN oluşturma alanlarının görünmesini engelliyordu.
- Varsayılan ders saatleri başlangıçta güvenle çağrılabilen bir yardımcı fonksiyona taşındı.
- Ders programı, PDF içe aktarma, arşiv ve mevcut tüm özellikler korunur.



v7.2.3 — KOMPAKT ÜST KONTROL ALANI
- Geri Al ve Yinele büyük metin düğmeleri yerine küçük ikon düğmeleri yapıldı.
- Gizlilik düğmesi kompakt kilit ikonuna dönüştürüldü.
- Yerel Veri Modu metni 'Yerel · Açık' olarak kısaltıldı.
- Yedek Al düğmesi küçültüldü.
- Ders Programı profil kartındaki konumunu korur.
- Amaç: iPhone'da profil altındaki kontrol alanının daha az yer kaplaması.



v7.2.4 — KİLİT + YEDEK KOMPAKT
- Kilitle düğmesi '🔒 Kilit' biçiminde küçültüldü.
- Yedek Al düğmesi '💾 Yedek' biçiminde küçültüldü.
- Gizlilik, Yerel durum, Kilit ve Yedek aynı kompakt satıra alındı.
- Dönem seçici + Geri Al + Yinele üst satırda kaldı.
- Böylece profil altındaki kontrol alanı mobilde iki satıra düşürüldü.



v7.2.5 — TEK SATIR MOBİL ARAÇ ÇUBUĞU
- Dönem, Geri Al, Yinele, gizlilik durum ışığı, Kilit ve Yedek tek satıra alındı.
- Gizlilik/Yerel Mod için ana ekranda yalnızca yeşil durum ışığı gösterilir.
- Yeşil ışığa dokununca mevcut Gizlilik kartı açılır; Yerel Veri Modu: Açık bilgisi kart içinde gösterilir.
- Kilit ve Yedek ikon-only kompakt kontrole dönüştürüldü.
- Profil yanındaki Ders Programı kartı sağa doğru genişletildi.


v7.5.3: Akıllı Uyarılar ana ekranda kompakt düğmeye dönüştürüldü. Tüm sınıflardaki veli görüşmelerini tarih sırasıyla gösteren genel Veli Görüşmeleri arşivi eklendi.


v7.6.1: Deneme modülü başlangıç güvenliği ve PWA cache hotfix.


v7.6.22: Oturma planına Otomatik Yerleştir, Karıştır, isteğe bağlı aynı-cinsiyet sıra kuralı ve cinsiyet bilgisi düzenleme eklendi. Cinsiyet isimden tahmin edilmez.


v7.6.54
- Uygulamada görünen sürüm numarası tüm ana noktalarda v7.6.54 olarak eşitlendi.
- Service Worker kayıt URL ve cache sürümü v7.6.54 yapıldı.
- Yeni Service Worker beklemeye geçtiğinde uygulama içinde “Yeni sürüm hazır / Güncelle” bildirimi gösterilir.
- Güncelle düğmesi yeni workerı devralır ve uygulamayı bir kez yeniler.
- Eski cacheler aktivasyonda temizlenir. localStorage verileri silinmez.
- v7.6.52 yedek aktarım düzeltmeleri korunur.
