<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:output  method="text"  version="1.0" encoding="UTF-8" indent="no"/>
  <xsl:strip-space elements="*" />
  <xsl:param name="this_page" />
  <xsl:template match="site">
    <xsl:for-each select="//page[link = $this_page]">
      <xsl:call-template name="title" />
    </xsl:for-each>
  </xsl:template>
  <xsl:template name="title">
  <xsl:choose>
  <xsl:when test="alt-title"><xsl:value-of select="alt-title" /></xsl:when>
  <xsl:otherwise>
    <xsl:value-of select="title" />
    </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>