const admZip = require('adm-zip');
const cheerio = require('cheerio');

class ExtractionEngine {
    /**
     * Zip file ekak aran eke thiyana HTML files scan karala elements extract kirima.
     */
    static extractFromZip(zipBuffer) {
        try {
            const zip = new admZip(zipBuffer);
            const zipEntries = zip.getEntries();
            const allExtractedData = [];

            zipEntries.forEach((entry) => {
                // Api check karanne HTML files witharai (React/Next projects wala unath static output eka HTML nisa)
                if (!entry.isDirectory && entry.entryName.endsWith('.html')) {
                    const htmlContent = entry.getData().toString('utf8');
                    const $ = cheerio.load(htmlContent);
                    const elements = [];

                    // Hama element ekakma scan kirima
                    $('*').each((i, el) => {
                        const $el = $(el);
                        const tagName = el.name;

                        // Analysis ekata wadagath elements witharak gamu (e.g., images, buttons, inputs)
                        if (['img', 'button', 'input', 'a', 'form', 'h1', 'h2', 'h3'].includes(tagName)) {
                            elements.push({
                                tag: tagName,
                                text: $el.text().trim(),
                                attributes: el.attribs, // class, id, alt, src, href okkoma methana thiyanawa
                                html: $.html(el).substring(0, 100) // Line eka identify karaganna podi snippet ekak
                            });
                        }
                    });

                    allExtractedData.push({
                        fileName: entry.entryName,
                        elementCount: elements.length,
                        elements: elements
                    });
                }
            });

            return allExtractedData;
        } catch (error) {
            console.error("Extraction Error:", error);
            throw new Error("Failed to extract and parse the ZIP file.");
        }
    }
}

module.exports = ExtractionEngine;