<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:output  method="text"  version="1.0" encoding="UTF-8" indent="no"/>
  <xsl:strip-space elements="*" />
  <xsl:param name="this_page" />
  <xsl:template match="site">

      <xsl:call-template name="title" />

  </xsl:template>
  <xsl:template name="title">
    <xsl:value-of select="site-description" />
  </xsl:template>
</xsl:stylesheet>
