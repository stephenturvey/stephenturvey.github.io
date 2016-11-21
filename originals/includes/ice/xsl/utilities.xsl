<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:strip-space elements="page" />
  <xsl:param name="this_page" />
  <xsl:template match="site">
    <ul class="utilities">
      <xsl:for-each select="page/page">
          <xsl:if test="@type = 'utility'">
         <li> <a>
              <xsl:attribute name="href"> <xsl:value-of select="link"/> </xsl:attribute>
              <xsl:value-of select="title" /> </a> </li>
          </xsl:if>
      </xsl:for-each>
      </ul>
  </xsl:template>
</xsl:stylesheet>