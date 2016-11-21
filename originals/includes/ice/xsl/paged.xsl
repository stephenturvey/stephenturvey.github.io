<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <!-- strip all spaces -->
  <xsl:strip-space elements="page" />
  <!-- accept page name variable from web page -->
  <xsl:param name="this_page" />
  <xsl:template match="site">
    <xsl:for-each select="//page[link = $this_page]">
      <xsl:if test="not(@type = 'utility')">
        <xsl:call-template name="list" />       
      </xsl:if>      
    </xsl:for-each>
  </xsl:template>    

<!-- template for pager links -->
<xsl:template name="list">
   <div class="paged">
   <ul>    
     <!-- PREVIOUS -->     
          
     <xsl:if test="preceding-sibling::page[1]">        
         <xsl:choose>
           <xsl:when test="preceding-sibling::page[1]/descendant::page">              
              <!-- preceding sibling with descendants -->
              <xsl:call-template name="preceding_descendant" />    
           </xsl:when>         
           <xsl:otherwise>           
              <!-- preceding sibling -->
              <xsl:call-template name="preceding_sibling" />   
           </xsl:otherwise>
         </xsl:choose>             
     </xsl:if>
     
     <xsl:if test="not(preceding-sibling::page[1])">        
         <xsl:choose>
           <xsl:when test="parent::page">              
              <!-- preceding parent -->
              <xsl:call-template name="preceding_parent" />    
           </xsl:when>         
           <xsl:otherwise>              
           </xsl:otherwise>
         </xsl:choose>             
     </xsl:if>
          
     <!-- NEXT -->
     
     <!-- descendants -->     
     <xsl:if test="descendant::page">  
        <!-- following descendant -->
        <xsl:call-template name="following_descendant" /> 
     </xsl:if>      
             
     <!-- all others -->
     <xsl:if test="not(descendant::page)">  
         <!-- following pages (other than descendants) -->
         <xsl:call-template name="following_not_descendant" />          
     </xsl:if>    
         
   </ul>  
   </div>
</xsl:template> 

<xsl:template name="preceding_descendant">   
  <li>
    <a class="previous">
      <xsl:attribute name="href">
      <xsl:value-of select="preceding-sibling::page[1]/descendant::page[last()]/link"/>
      </xsl:attribute>
      Prev
    </a>
  </li>  
</xsl:template>

<xsl:template name="preceding_sibling"> 
  <li>
    <a class="previous">
      <xsl:attribute name="href">
      <xsl:value-of select="preceding-sibling::page[1]/link"/>
      </xsl:attribute>
      Prev
    </a>
  </li> 
</xsl:template>

<xsl:template name="preceding_parent">  
  <li>
    <a class="previous">
      <xsl:attribute name="href">
      <xsl:value-of select="parent::page/link"/>
      </xsl:attribute>
      Prev
    </a>
  </li> 
</xsl:template>

<xsl:template name="following_descendant">  
  <xsl:if test="page[not(@type = 'utility')]">
    <li>
      <a class="next">
        <xsl:attribute name="href">
        <xsl:value-of select="page/link"/>
        </xsl:attribute>
        Next
      </a>
    </li>
  </xsl:if> 
</xsl:template>

<xsl:template name="following_not_descendant">  
     <xsl:if test="following::page[1][not(@type = 'utility')]">     
       <li>
         <a class="next">
          <xsl:attribute name="href">
          <xsl:value-of select="following::page[1]/link"/>
          </xsl:attribute>
         Next
        </a>
       </li>      
   </xsl:if>            
</xsl:template>

</xsl:stylesheet>
