# MualliMate+ v7.8.206 — Test Sıralaması (ön test)

Bu paket v7.8.205 Sistem Sağlığı düzeltmesindeki **index.html** üzerine hazırlanmıştır. **Optik okuma algoritması değiştirilmemiştir.**

## Yeni özellikler
- Test ödevi içinden **🏆 Test Sıralaması** açılır.
- Ölçüt: **Net** (Doğru − Yanlış / 4) veya **Doğru sayısı**.
- Kapsam: **Tüm sınıflar** veya ilgili sınıflardan biri.
- Tüm sınıflar listesinde öğrenci adının yanında ayrı bir **Sınıf** sütunu bulunur.
- Eşit puanlı öğrenciler **aynı dereceyi** paylaşır; ad soyadlarına göre **Türkçe alfabetik sırayla** listelenir.
- Sonuç girilmemiş veya geçersiz kayıtlar sıralanmaz; kayıtları değiştirilmez.
- **Diğer Sınıflara Kopyala** ile kopyalanan yeni testler, `testGroupId` alanı sayesinde otomatik bağlanır.
- Önceden ayrı ayrı eklenen/kopyalanan aynı testler **Diğer sınıfların testlerini bağla** ekranından bir kez eşleştirilir. **Sadece isim benzerliğiyle otomatik birleştirme yapılmaz.**
- CSV olarak dışa aktarılabilir.

## Güvenli deneme
1. Önce doğrulanmış tam yedeğinizi cihaz dışında saklayın.
2. Yalnız **MualliMate TEST** profilinde deneyin. Öğrenci sayısı vb. kayıtları karşılaştırın.
3. Test ödevine girip **Test Sıralaması** düğmesine basın.
4. Sınıf / Tüm sınıflar ve Net / Doğru seçimlerini, eşitlik durumlarını kontrol edin.
5. Bir test ödevini diğer sınıfa kopyalayıp birden çok sınıfın sonuçlarını doğrulayın.
6. Eski testler için bağlantıyı elle kurun. Başka bir gruba bağlı testleri birleştirme engellenir.
7. Test ortamındaki doğrulamadan sonra GitHub'da mevcut çalışan `index.html` dosyasını saklayarak yayımlayın.

**Önemli:** Paket test edilmeden canlı GitHub/PWA kaynağının üzerine yüklenmemelidir. `testGroupId` haricinde öğrenci/test verisi şeması değiştirilmemiştir.
