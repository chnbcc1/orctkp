# MualliMate+ v7.8.209 — Çok Sınıflı Deneme ve Optik Akışı

## Sıralama çıktısı
Ekran, PDF ve CSV sütunları: Sıra → Sınıf → No → Öğrenci → Doğru → Yanlış → Boş → Net.

## Yeni deneme
1. Bir sınıf içindeki Denemeler bölümünden Yeni Deneme'yi açın.
2. Ad, tarih ve uygulanacak sınıfları seçin.
3. Kitapçık grubu yok (tek anahtar), A/B veya A/B/C/D tercihini yapın.
4. En çok 6 dersin adını ve her ders için 1–50 soru sayısını girin. Şık sayısı ve net hesabını seçin.
5. Denemeyi oluşturun. İşaretli seçenekle doğrudan optik form ve cevap anahtarları açılır.
6. Cevap anahtarlarını tamamlayıp kaydedin. Aynı denemenin seçilen sınıflarına aynı form ve anahtarlar kaydedilir. Diğer kitapçık kombinasyonları mevcut optik hazırlayıcıda seçilebilir.
7. Deneme ekranındaki sınıf düğmeleriyle geçiş yapın. Her sınıfın optiklerini kendi ekranındaki Optiklerini Oku düğmesinden okutun; karma sınıf kâğıtları tek toplu okumada otomatik dağıtılmaz.

Öğrenci sonuçları sınıflar arasında taşınmaz; her sınıfa ayrı kayıt açılır. Deneme adı, tarihi, net hesabı ve optik anahtarları aynı uygulamanın sınıflarında ortak güncellenir. Bir sınıftaki denemeyi silmek diğer sınıf kopyalarını silmez.

Henüz anahtar girilmemiş denemede boş form önizlenebilir; okuma için cevap anahtarlarının tamamlanması gerekir. Eski denemeler kendi kayıtları olarak korunur; isim benzerliğiyle birleştirilmez. Sonuç girilmiş denemenin ders adlarını veya bilinen soru sayılarını değiştirmek engellenir.

## Kurulum
Paket yalnız değişen index.html ve bu açıklamayı içerir. Mevcut uygulama klasöründeki index.html yerine kullanılır; diğer dosyalar korunur. Önceki sürümler ayrıca saklanmıştır.

## Doğrulama
Çok sınıflı oluşturma, kitapçık yok/A-B/A-B-C-D, sınıflarda aynı öğrenci numarasının ayrılığı, ortak anahtarların bağımsız kopyalanması, mevcut sonuçların korunması, eski kayıt uyumu ve kaydetme hatasında geri alma kontrolleri geçti. Net/doğru sıralaması, eşitlik, CSV, PDF sayfalama testleri geçti. PDF görsel olarak kontrol edildi. Optik fiziksel okuma algoritması değiştirilmedi; yalnız mevcut doğrulama ve form toplama işlevlerine bağlantı eklendi.

Gerçek telefondaki yeni arayüz ve basılı optikle baştan sona okuma bu ortamda denenmemiştir.
