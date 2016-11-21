<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:strip-space elements="page" />
  <xsl:param name="this_page" />
  <xsl:template match="site">
    <xsl:for-each select="//page[link = $this_page]">
      <xsl:call-template name="children" />
    </xsl:for-each>
  </xsl:template>
  <xsl:template name="children">
      <xsl:for-each select="page [not(@type = 'utility')]">
      <dl class="gallery">
            <dt class="title">
              <a>
              <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
              <xsl:if test="thumbnail"><xsl:element name="img"><xsl:attribute name="src"><xsl:value-of select="thumbnail" /></xsl:attribute></xsl:element></xsl:if><xsl:value-of select="title" /></a></dt>
            <dd class="description"><xsl:value-of select="description" /></dd>  
        </dl>
      </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>