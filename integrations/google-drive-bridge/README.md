# BuildWise AI — Google Drive Bridge

این پل برای دسترسی BuildWise AI به Google Drive و Google Sheets ساخته شده است.

1. در Google Drive یک Apps Script جدید بسازید.
2. محتوای \`integrations/google-drive-bridge/Code.gs\` را در آن قرار دهید.
3. در Script Properties یک مقدار با نام \`BUILDWISE_BRIDGE_TOKEN\` بسازید و یک توکن تصادفی قرار دهید.
4. Deploy > New deployment > Web app را انتخاب کنید.
5. اجرای برنامه را روی حساب خودتان قرار دهید تا دسترسی Drive با مجوز همان حساب انجام شود.
6. دسترسی Web App را طبق سطح دسترسی موردنیاز خودتان تنظیم کنید.
7. URL و توکن را در بخش «ورود داده» BuildWise AI وارد کنید.

این پل می‌تواند فهرست فایل‌های Sheets/Excel در Drive و داده یک Sheet مشخص را برگرداند. توکن را داخل GitHub یا کد فرانت‌اند قرار ندهید.
