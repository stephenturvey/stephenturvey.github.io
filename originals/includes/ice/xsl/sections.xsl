<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" omit-xml-declaration="yes" indent="yes" />
  <xsl:param name="this_page" />
  <xsl:template match="/">
    <ul class="sections">
<xsl:for-each select="site/page[not(@type = 'utility')]">
        <xsl:element name="li">
          <xsl:element name="a">
            <xsl:attribute name="href"><xsl:value-of select="link"/> </xsl:attribute>
            <xsl:if test="self::page[link = $this_page]">
              <xsl:attribute name="class">selected</xsl:attribute>
            </xsl:if>
            <xsl:value-of select="title"/>
          </xsl:element>
        </xsl:element>
      </xsl:for-each>
      
      <xsl:for-each select="site/page/page[not(@type = 'utility')]">
        <xsl:element name="li">
          <xsl:element name="a">
            <xsl:attribute name="href"><xsl:value-of select="link"/> </xsl:attribute>
            <xsl:if test="descendant-or-self::page[link = $this_page]">
              <xsl:attribute name="class">selected</xsl:attribute>
            </xsl:if>
            <xsl:value-of select="title"/>
          </xsl:element>
        </xsl:element>
      </xsl:for-each>
      
    </ul>
  </xsl:template>
</xsl:stylesheet>